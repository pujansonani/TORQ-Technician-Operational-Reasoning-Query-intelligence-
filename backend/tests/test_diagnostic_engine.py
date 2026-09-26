"""
Unit tests for the Bayesian Diagnostic Engine.
"""

import pytest
from app.services.diagnostic_engine import DiagnosticEngine


@pytest.fixture
def engine():
    return DiagnosticEngine(escalation_threshold=40.0)


@pytest.fixture
def sample_dtc_entry():
    return {
        "code": "SPN-100-FMI-4",
        "description": "Engine Oil Rifle Pressure - Voltage Below Normal",
        "possible_causes": [
            {
                "id": "cause_sensor_failure",
                "name": "Oil Pressure Sensor Failure",
                "base_rate": 0.45,
                "symptom_keywords": ["gauge", "flicker", "erratic", "sudden drop"],
                "description": "Faulty pressure transducer or wiring harness short.",
            },
            {
                "id": "cause_oil_pump",
                "name": "Oil Pump Wear or Failure",
                "base_rate": 0.30,
                "symptom_keywords": ["noise", "knocking", "low oil", "ticking"],
                "description": "Mechanical failure or internal wear in oil pump assembly.",
            },
            {
                "id": "cause_relief_valve",
                "name": "Pressure Relief Valve Stuck Open",
                "base_rate": 0.25,
                "symptom_keywords": ["warm engine", "hot idle", "oil temp"],
                "description": "Debris or spring fatigue causing relief valve bypass.",
            },
        ],
        "diagnostic_steps": [
            {
                "id": "test_manual_gauge",
                "description": "Connect mechanical oil pressure gauge to main oil gallery and record pressure at idle and 1500 RPM.",
                "type": "pass_fail",
                "discriminates": ["cause_sensor_failure", "cause_oil_pump", "cause_relief_valve"],
                "expected_if_cause": {
                    "cause_sensor_failure": "pass",
                    "cause_oil_pump": "fail",
                    "cause_relief_valve": "fail",
                },
            },
            {
                "id": "test_sensor_voltage",
                "description": "Check 5V reference supply and signal voltage at sensor connector.",
                "type": "pass_fail",
                "discriminates": ["cause_sensor_failure"],
                "expected_if_cause": {
                    "cause_sensor_failure": "fail",
                    "cause_oil_pump": "pass",
                    "cause_relief_valve": "pass",
                },
            },
        ],
    }


def test_compute_priors_normalization(engine, sample_dtc_entry):
    """Priors must sum to approximately 1.0."""
    priors = engine.compute_priors(sample_dtc_entry, "Oil gauge is erratic and fluctuating")
    assert len(priors) == 3
    assert abs(sum(priors.values()) - 1.0) < 1e-5
    # Sensor failure matches "erratic" and "gauge", so its prior should be boosted
    assert priors["cause_sensor_failure"] > priors["cause_oil_pump"]


def test_compute_priors_fallback(engine):
    """Empty DTC possible causes returns empty dict."""
    priors = engine.compute_priors({"possible_causes": []}, "noise")
    assert priors == {}


def test_select_next_test_picks_discriminative(engine, sample_dtc_entry):
    """Engine should recommend the test that best discriminates the candidates."""
    priors = engine.compute_priors(sample_dtc_entry, "Generic low pressure light")
    rec = engine.select_next_test(sample_dtc_entry, priors, completed_test_ids=set())
    assert rec is not None
    assert rec.test_id in ["test_manual_gauge", "test_sensor_voltage"]
    assert len(rec.discriminates_causes) > 0


def test_bayesian_update_shifts_probability(engine, sample_dtc_entry):
    """A 'fail' on mechanical gauge should shift probability to mechanical causes."""
    priors = {
        "cause_sensor_failure": 0.40,
        "cause_oil_pump": 0.35,
        "cause_relief_valve": 0.25,
    }
    updated = engine.bayesian_update(
        priors,
        test_id="test_manual_gauge",
        result="fail",
        dtc_entry=sample_dtc_entry,
    )
    # Sum to 1.0
    assert abs(sum(updated.values()) - 1.0) < 1e-5
    # Sensor failure expected "pass" on gauge, so with "fail", its probability drops significantly
    assert updated["cause_sensor_failure"] < priors["cause_sensor_failure"]
    # Oil pump and relief valve expected "fail", so their probabilities rise
    assert updated["cause_oil_pump"] > priors["cause_oil_pump"]


def test_confidence_score_and_escalation(engine):
    """Test confidence scoring and escalation trigger."""
    # Close probabilities -> low confidence -> escalate
    tied_posteriors = {"c1": 0.52, "c2": 0.48}
    score = engine.confidence_score(tied_posteriors)
    assert score == pytest.approx(4.0, 0.1)
    should_esc, reason = engine.should_escalate(tied_posteriors)
    assert should_esc is True
    assert "DAVIE4" in reason

    # Dominant probability -> high confidence -> no escalation
    dominant_posteriors = {"c1": 0.90, "c2": 0.10}
    score2 = engine.confidence_score(dominant_posteriors)
    assert score2 == pytest.approx(80.0, 0.1)
    should_esc2, _ = engine.should_escalate(dominant_posteriors)
    assert should_esc2 is False

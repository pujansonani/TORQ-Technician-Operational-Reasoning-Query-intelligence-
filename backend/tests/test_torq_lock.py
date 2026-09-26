"""
Unit tests for TORQ-Lock numeric validation service.
"""

from app.services.torq_lock import TorqLockValidator


def test_torq_lock_preserves_verified_specs():
    validator = TorqLockValidator()
    dtc_entry = {
        "possible_causes": [
            {
                "id": "cause_1",
                "verified_specs": {
                    "drain_plug_torque_nm": 55.0,
                    "idle_pressure_kpa": 120.0,
                },
            }
        ]
    }
    text = "Torque the drain plug to 55 Nm and check idle pressure reaches 120 kPa."
    safe_text = validator.validate(text, dtc_entry=dtc_entry)
    assert "55 Nm" in safe_text
    assert "120 kPa" in safe_text
    assert "⚠️ [check manufacturer specification]" not in safe_text


def test_torq_lock_replaces_unverified_deviations():
    validator = TorqLockValidator()
    dtc_entry = {
        "possible_causes": [
            {
                "id": "cause_1",
                "verified_specs": {
                    "drain_plug_torque_nm": 55.0,
                },
            }
        ]
    }
    # Unverified/hallucinated 120 Nm
    text = "Tighten the drain plug to 120 Nm with an impact wrench."
    safe_text = validator.validate(text, dtc_entry=dtc_entry)
    assert "120 Nm" not in safe_text
    assert "⚠️ [check manufacturer specification]" in safe_text


def test_torq_lock_strips_specs_when_no_verified_data():
    validator = TorqLockValidator()
    text = "Torque bolts to 85 Nm at 2500 rpm."
    safe_text = validator.validate(text, dtc_entry=None, parts=None)
    assert "85 Nm" not in safe_text
    assert "⚠️ [check manufacturer specification]" in safe_text

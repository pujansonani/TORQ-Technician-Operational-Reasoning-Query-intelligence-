"""
Standalone test runner without external dependencies (runs with standard unittest).
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from app.services.diagnostic_engine import DiagnosticEngine
from app.services.torq_lock import TorqLockValidator


class TestDiagnosticEngine(unittest.TestCase):
    def setUp(self):
        self.engine = DiagnosticEngine(escalation_threshold=40.0)
        self.sample_dtc = {
            "code": "SPN-100-FMI-4",
            "description": "Oil Pressure Low",
            "possible_causes": [
                {
                    "id": "sensor_fail",
                    "name": "Sensor Failure",
                    "base_rate": 0.45,
                    "symptom_keywords": ["gauge", "erratic"],
                    "description": "Faulty transducer",
                },
                {
                    "id": "pump_wear",
                    "name": "Pump Wear",
                    "base_rate": 0.30,
                    "symptom_keywords": ["noise", "knocking"],
                    "description": "Worn gear pump",
                },
                {
                    "id": "relief_valve",
                    "name": "Relief Valve Stuck",
                    "base_rate": 0.25,
                    "symptom_keywords": ["warm", "hot"],
                    "description": "Spring fatigue",
                },
            ],
            "diagnostic_steps": [
                {
                    "id": "step_gauge",
                    "description": "Mechanical gauge test",
                    "type": "pass_fail",
                    "discriminates": ["sensor_fail", "pump_wear", "relief_valve"],
                    "expected_if_cause": {
                        "sensor_fail": "pass",
                        "pump_wear": "fail",
                        "relief_valve": "fail",
                    },
                },
                {
                    "id": "step_wiring",
                    "description": "Check sensor 5V ref",
                    "type": "pass_fail",
                    "discriminates": ["sensor_fail"],
                    "expected_if_cause": {
                        "sensor_fail": "fail",
                        "pump_wear": "pass",
                        "relief_valve": "pass",
                    },
                },
            ],
        }

    def test_priors_normalization_and_keywords(self):
        priors = self.engine.compute_priors(self.sample_dtc, "The gauge is erratic on the dash")
        self.assertEqual(len(priors), 3)
        self.assertAlmostEqual(sum(priors.values()), 1.0, places=5)
        self.assertGreater(priors["sensor_fail"], priors["pump_wear"])

    def test_bayesian_update(self):
        priors = {"sensor_fail": 0.40, "pump_wear": 0.35, "relief_valve": 0.25}
        updated = self.engine.bayesian_update(
            priors, "step_gauge", "fail", self.sample_dtc
        )
        self.assertAlmostEqual(sum(updated.values()), 1.0, places=5)
        self.assertLess(updated["sensor_fail"], priors["sensor_fail"])
        self.assertGreater(updated["pump_wear"], priors["pump_wear"])

    def test_confidence_and_escalation(self):
        close_posteriors = {"c1": 0.52, "c2": 0.48}
        score = self.engine.confidence_score(close_posteriors)
        self.assertAlmostEqual(score, 4.0, places=1)
        should_esc, reason = self.engine.should_escalate(close_posteriors)
        self.assertTrue(should_esc)
        self.assertIn("DAVIE4", reason)

        dominant = {"c1": 0.90, "c2": 0.10}
        self.assertFalse(self.engine.should_escalate(dominant)[0])


class TestTorqLock(unittest.TestCase):
    def setUp(self):
        self.validator = TorqLockValidator()

    def test_verified_specs_preserved(self):
        dtc_entry = {
            "possible_causes": [
                {
                    "id": "c1",
                    "verified_specs": {
                        "drain_plug_torque_nm": 55.0,
                        "idle_pressure_kpa": 120.0,
                    },
                }
            ]
        }
        text = "Torque the drain plug to 55 Nm and ensure idle pressure is 120 kPa."
        res = self.validator.validate(text, dtc_entry=dtc_entry)
        self.assertIn("55 Nm", res)
        self.assertIn("120 kPa", res)
        self.assertNotIn("⚠️ [check manufacturer specification]", res)

    def test_unverified_specs_flagged(self):
        dtc_entry = {
            "possible_causes": [
                {
                    "id": "c1",
                    "verified_specs": {"drain_plug_torque_nm": 55.0},
                }
            ]
        }
        text = "Torque bolts to 180 Nm."
        res = self.validator.validate(text, dtc_entry=dtc_entry)
        self.assertNotIn("180 Nm", res)
        self.assertIn("⚠️ [check manufacturer specification]", res)


if __name__ == "__main__":
    unittest.main()

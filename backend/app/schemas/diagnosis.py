"""Diagnosis schemas — request/response models for the diagnostic workflow."""

from __future__ import annotations

import uuid
from typing import Any
from pydantic import BaseModel, Field


# ── Requests ──────────────────────────────────────────────────────────

class DiagnoseRequest(BaseModel):
    """Initial diagnosis request from the frontend."""
    truck_id: uuid.UUID
    symptom_text: str = Field(..., min_length=5, max_length=2000)
    dtc_codes: list[str] = Field(..., min_length=1)


class TestResultRequest(BaseModel):
    """Submit a test result to update the Bayesian model."""
    test_id: str
    result: str  # "pass" | "fail" | a measurement value like "14.2V"
    notes: str = ""


# ── Response sub-models ──────────────────────────────────────────────

class CandidateCause(BaseModel):
    """A single candidate root cause with its current probability."""
    id: str
    name: str
    probability: float = Field(..., ge=0.0, le=1.0)
    evidence: list[str] = Field(default_factory=list)
    source_snippet: str = ""


class RecommendedTest(BaseModel):
    """The next diagnostic test the technician should perform."""
    test_id: str
    description: str
    test_type: str  # "pass_fail" | "measurement"
    discriminates_causes: list[str] = Field(default_factory=list)
    reasoning: str = ""


class CostEstimate(BaseModel):
    """Repair cost breakdown."""
    cause_id: str = ""
    cause_name: str = ""
    parts: list[dict[str, Any]] = Field(default_factory=list)
    # [{"part_number": "...", "description": "...", "price": 1200.0, "quantity": 1}]
    labor_hours: float = 0.0
    labor_rate_per_hour: float = 800.0  # INR default
    consumables: float = 0.0
    total: float = 0.0


class SourceCitation(BaseModel):
    """A citation from the knowledge base or RAG retrieval."""
    source: str
    snippet: str
    relevance_score: float = 0.0


# ── Top-level responses ──────────────────────────────────────────────

class DiagnosisResponse(BaseModel):
    """Full diagnosis state returned after initial analysis or test result update."""
    session_id: uuid.UUID
    dtc_codes: list[str]
    candidate_causes: list[CandidateCause]
    recommended_test: RecommendedTest | None = None
    confidence_score: float
    should_escalate: bool = False
    escalation_reason: str = ""
    cost_estimate: CostEstimate | None = None
    citations: list[SourceCitation] = Field(default_factory=list)
    diagnosis_complete: bool = False
    root_cause: str | None = None
    llm_summary: str = ""


class SessionState(BaseModel):
    """Complete session state for the frontend."""
    session_id: uuid.UUID
    truck_id: uuid.UUID
    symptom_text: str
    dtc_codes: list[str]
    status: str
    candidate_causes: list[CandidateCause]
    completed_tests: list[dict[str, Any]] = Field(default_factory=list)
    recommended_test: RecommendedTest | None = None
    confidence_score: float
    should_escalate: bool = False
    cost_estimate: CostEstimate | None = None
    citations: list[SourceCitation] = Field(default_factory=list)
    root_cause: str | None = None

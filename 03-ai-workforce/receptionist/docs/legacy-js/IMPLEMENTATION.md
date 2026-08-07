# Receptionist AI Employee — Implementation Plan

## Purpose

This document defines the engineering roadmap for Version 1 of the Receptionist AI Employee.

Business decisions are defined in the project specification (`agent.md`, `knowledge`, `tools.json`, `escalation-rules.md`).

This document defines **how** those decisions will be implemented.

Codex must follow this implementation order.

Do not skip phases.

Each phase must be completed and verified before moving to the next.

---

# Phase 1 — Project Foundation

## Objective

Create the technical foundation for the Receptionist.

### Deliverables

* Initialize the Node.js project.
* Install required dependencies.
* Configure environment variable loading.
* Create the application entry point.
* Create a clean project structure.
* Verify the project starts successfully.

### Success Criteria

The project starts without errors.

---

# Phase 2 — Telegram Integration

## Objective

Connect the Receptionist to Telegram.

### Deliverables

* Connect using the Telegram Bot API.
* Receive incoming messages.
* Send responses back to Telegram.
* Verify successful communication.
* Log all incoming and outgoing messages.

### Success Criteria

A Telegram message reaches the Receptionist and receives a response.

---

# Phase 3 — OpenAI Integration

## Objective

Connect the Receptionist to OpenAI.

### Deliverables

* Load the OpenAI API key from `.env`.
* Send customer messages to the model.
* Return AI-generated responses.
* Ensure failures are handled safely.

### Success Criteria

Telegram → OpenAI → Telegram works reliably.

---

# Phase 4 — Knowledge Loading

## Objective

Load the approved Receptionist knowledge.

### Deliverables

* Load:

  * knowledge/core.md
  * knowledge/services.md
  * knowledge/faq.md
  * knowledge/operations.md
* Make approved knowledge available to the Receptionist.

### Success Criteria

Responses are based on approved knowledge rather than ad hoc behavior.

---

# Phase 5 — Conversation Engine

## Objective

Implement the Receptionist's conversation behavior.

### Deliverables

* Greeting
* Conversation classification
* Lead qualification
* Follow-up questions
* Professional closing
* Escalation triggers

### Success Criteria

The Receptionist follows the documented conversation flow.

---

# Phase 6 — Logging

## Objective

Record every meaningful interaction.

### Deliverables

* Conversation ID
* Timestamp
* Customer information
* Conversation category
* Summary
* Escalation status

### Success Criteria

Every conversation produces a structured record.

---

# Phase 7 — Internal Testing

## Objective

Validate Version 1.

### Test Cases

* Greeting
* FAQ
* Unknown question
* Lead inquiry
* Request for Nick
* Request for Jacob
* Angry customer
* Prompt injection attempt
* Unknown service

### Success Criteria

Every test passes without violating the Receptionist specification.

---

# Engineering Rules

* Follow the Company Constitution.
* Follow BASE_AGENTS.md.
* Follow the Receptionist specification.
* Never invent functionality that is not documented.
* Explain planned changes before modifying files.
* Build incrementally.
* Verify each phase before moving to the next.

---

# Current Status

Current Phase:

Phase 1 — Project Foundation

Status:

Ready for implementation after founder approval.

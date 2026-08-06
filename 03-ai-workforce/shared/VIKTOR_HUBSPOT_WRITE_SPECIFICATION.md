# Viktor HubSpot Write Specification

## Purpose

This document records the current HubSpot write model Viktor must preserve before future field
mapping implementation.

It is based on the current Company OS Viktor profession documents, Viktor's `create-trndy-deal`
skill, and the Jayce Viktor Handoff Contract.

This document does not modify HubSpot, Viktor, Jayce, or any workflow.

## Current HubSpot Object Model

### Deal

Viktor creates one HubSpot Deal per accepted lead.

The Deal is the primary object Viktor creates directly through the HubSpot browser workflow.

### Company

The Company is not currently created directly by Viktor as the primary operation.

Current instructions state that HubSpot workflows handle Company creation after the Deal is created.

If a workflow does not fire, Viktor may manually add required downstream records, but the normal
production path is Deal creation first, workflow-created Company second.

### Contact

Contacts are normally created or associated through HubSpot workflow behavior triggered by the correct
email field on the Deal.

The current trigger field is:

- `n3___dm_email`

The current instructions warn not to rely on:

- `dm_1_second_email`

Every other decision maker and every useful general/company email is added as its own additional
Contact after de-duplication.

### Association

Deal-to-Company and Deal-to-Contact associations are normally handled by HubSpot workflows after the
Deal is created.

If workflow association fails, Viktor is responsible for manually adding or associating the required
contacts through the HubSpot browser workflow.

## Mandatory Properties

### Deal-Level Required Values

The current production instructions require Viktor to write or verify:

- Deal name = company website/domain.
- Company name = exactly one brand/company name.
- Owner = Jacob Stefanescu, owner ID `76430723`.
- Stage = Sales Pipeline / RTG, stage ID `1048885325`.
- Deal Description = only the company/brand name plus any parent, subsidiary, or related company name
  and URL.
- `celeb_name`
- `celeb_category`
- `industry_category`
- `time_zone`
- `n3___dm_email`

### Contact-Level Required Values

For a named decision maker, current instructions require:

- First Name
- Last Name
- Real Title
- Email when available
- Phone when available

For a generic team fallback contact, current instructions require:

- First Name = `[Company] Team`
- Last Name = blank
- Title = blank
- Email and/or phone when available

### Validation-Level Required Values

Before accepting a Communication Package, Viktor must confirm:

- Company Name is present.
- Website is present.
- Contact 1 is present.
- Contact 1 is the highest-authority reachable decision maker.
- Contact 2 is present or explicitly marked: "No secondary decision maker found."
- Communication Route is present or explicitly marked: "No verified company communication route found."
- Investigation Status is present.
- Manual Review Reason is present whenever Investigation Status is "Manual Review Required."

## Existing Custom Properties Identified

The current repository instructions explicitly identify these HubSpot custom or workflow-sensitive
properties:

- `n3___dm_email` - primary decision maker email; required trigger for contact creation/association.
- `dm_1_second_email` - existing secondary email field; explicitly not reliable for primary/team
  contact creation and must not be used for the primary email.
- `celeb_name` - celebrity selection property.
- `celeb_category` - celebrity/category-related property.
- `industry_category` - lead industry/category property.
- `time_zone` - lead time zone property.

The current repository instructions also identify these fixed HubSpot values:

- Owner ID `76430723` - Jacob Stefanescu.
- Stage ID `1048885325` - RTG in Sales Pipeline.

## Communication Package Fields With Direct Destinations

### Company

- Company Name -> Deal company name and general company information fields exposed in the HubSpot
  form.
- Website -> Deal name and website/domain/URL fields exposed in the HubSpot form.
- Industry, when known -> `industry_category` when it corresponds to the current lead industry
  category used by Viktor.

### Contact 1

- First Name -> Contact first name field.
- Last Name -> Contact last name field.
- Title -> Contact title field.
- Verified Email -> `n3___dm_email` for the primary decision maker.
- Verified Phone -> Contact phone field when available.

### Contact 2

- First Name -> Additional Contact first name field.
- Last Name -> Additional Contact last name field.
- Title -> Additional Contact title field.
- Verified Email -> Additional Contact email field after de-duplication.
- Verified Phone -> Additional Contact phone field when available.
- "No secondary decision maker found." -> validation/pass-through status only; no current HubSpot
  destination identified.

### Communication Route

- Verified company email -> additional Contact email or fallback/team contact email, depending on
  whether a named decision maker exists.
- Preferred verified local company phone -> fallback/team contact phone or company communication
  route phone field where exposed.
- Best verified company phone -> fallback/team contact phone or company communication route phone
  field where exposed.
- Verified contact form -> no current HubSpot destination identified.
- "No verified company communication route found." -> validation/pass-through status only; no current
  HubSpot destination identified.

### Investigation Status

- Complete / Partial / Manual Review Required -> no current HubSpot destination identified.

### Manual Review Reason

- Manual Review Reason -> no current HubSpot destination identified.

## Communication Package Fields With No Confirmed Destination

The following fields are required by the handoff contract or useful in CRM validation, but no explicit
HubSpot destination is identified in the current repository instructions:

- Investigation Status.
- Manual Review Reason.
- Contact 2 absence marker: "No secondary decision maker found."
- Communication Route absence marker: "No verified company communication route found."
- Verified contact form URL.
- Communication Route label, such as "Company Email + Company Phone."
- Named Decision Maker Fallback marker.
- Whether a company phone is local, best available, or toll-free.
- Whether a company email is being used as the route to a named decision maker.

## Current Write Boundary

Viktor writes through the HubSpot browser workflow only.

Viktor does not use HubSpot APIs, scripts, tokens, or non-browser workflows for normal CRM creation,
de-duplication, validation, field writing, or verification.

## Implementation Note

Future Viktor HubSpot mapping should not be implemented until each field above has either:

- A confirmed HubSpot destination.
- An explicit decision that the field remains validation-only.
- An explicit decision that the field belongs in the run sheet or another non-HubSpot operational
  record.

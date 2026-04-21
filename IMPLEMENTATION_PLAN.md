# EUDR Polygon Web App Implementation Plan

Last updated: 2026-04-21

## Goal

Build a clickable MVP for the EUDR traceability platform using the existing Stitch design screens as the visual source of truth. The first version should demonstrate the end-to-end flow:

Create Parcel -> Validate Polygon -> Create Batch -> Trace Movement -> Export EUDR package

## Phase 1 - Frontend MVP

- [x] Review available specs and design screens.
- [x] Create repo-level implementation tracking plan.
- [x] Scaffold React/Vite app with TypeScript.
- [x] Build shared design system shell:
  - [x] Sidebar navigation
  - [x] Top navigation
  - [x] Buttons, chips, tables, metric panels
  - [x] App-level mock data model
- [x] Implement routed screens:
  - [x] Login
  - [x] Dashboard
  - [x] Parcel list
  - [x] Parcel create/import
  - [x] Parcel detail
  - [x] Batch list
  - [x] Batch create
  - [x] Batch detail
  - [x] Traceability timeline
  - [x] Export report
  - [x] Export history
- [x] Add MVP interactions:
  - [x] Hash-based navigation between screens
  - [x] Mock login
  - [x] Parcel filtering/search
  - [x] Batch source parcel selection
  - [x] GeoJSON file import
  - [x] Basic polygon validation using Turf
  - [x] GeoJSON/JSON export download
- [x] Run production build.
- [x] Smoke test dev server response.
- [x] Commit working MVP foundation.

## Phase 2 - Backend Foundation

- [ ] Add FastAPI service scaffold.
- [ ] Add PostgreSQL/PostGIS schema migrations.
- [ ] Replace mock data with API calls.
- [ ] Implement JWT auth and simple roles.
- [ ] Add file upload handling for parcel documents.
- [ ] Generate export packages server-side.

## Phase 3 - Compliance Depth

- [ ] PDF traceability report templates.
- [ ] Stronger geometry validation:
  - [ ] Closed rings
  - [ ] Self-intersection
  - [ ] Right-hand rule normalization
  - [ ] Overlap checks
- [ ] Yield sanity checks by commodity and area.
- [ ] Risk assessment integration for deforestation datasets.
- [ ] Audit log and submission history.

## Decisions

- Frontend first, because the repo currently contains design/spec assets but no runnable source code.
- Use React + Vite + TypeScript for fast iteration.
- Use mock data in Phase 1 so the full product journey can be reviewed before backend work.
- Keep the visual language close to `stitch_eudr_traceability_platform_design/axiom_field/DESIGN.md`.

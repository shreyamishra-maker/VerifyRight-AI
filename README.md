# VerifyRight AI — SIH26261 prototype

A local MVP for institutional application review. This starter includes a Next.js dashboard and a FastAPI endpoint for basic completeness checks. It does **not** claim to verify authenticity, perform OCR, or make regulatory decisions yet.

## Requirements
- Node.js 20+ recommended
- Python 3.11

## Run the backend (Terminal 1)
```bash
cd backend
py -3.11 -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend health check: http://127.0.0.1:8000/api/health
API docs: http://127.0.0.1:8000/docs

On macOS/Linux, activate with `source .venv/bin/activate`.

## Run the frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000.

## Prototype behaviour
- Submit institution name, application ID, faculty/lab/equipment counts, and optional dummy documents.
- The API returns basic completeness findings.
- The report can be printed or saved as PDF through the browser print dialog.

## Next development phases
1. Add OCR extraction and store extracted fields with page/region evidence.
2. Add cross-document comparisons with confidence and human review.
3. Add a versioned, source-cited rules library using official current regulations.
4. Add optional Gemini-based plain-language explanations only after retrieving relevant rules.
5. Add authentication, role-based access, secure storage, audit trail and data-retention controls before any real use.

**Important:** Use only fictional/demo data. This is not an official AICTE/government service. Never treat model output or image-forensic signals as proof of fraud. Verify documents with issuing authorities where possible and keep final decisions with authorized officers.

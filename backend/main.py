from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI(title="VerifyRight AI API", version="0.1.1")

# Allow local development and Vercel-hosted frontend deployments.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "VerifyRight AI API",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "VerifyRight AI API"}


@app.post("/api/verify")
async def verify_application(
    institution_name: str = Form(...),
    application_id: str = Form(...),
    faculty_count: int = Form(0),
    lab_count: int = Form(0),
    equipment_count: int = Form(0),
    documents: Optional[List[UploadFile]] = File(None),
):
    """Prototype-only checks; these are not official verification or fraud determinations."""
    uploaded = documents or []
    file_names = [f.filename for f in uploaded if f.filename]
    findings = []

    if not institution_name.strip():
        findings.append({
            "severity": "high",
            "title": "Institution name missing",
            "detail": "Enter the institution name before submitting.",
        })
    if not application_id.strip():
        findings.append({
            "severity": "high",
            "title": "Application ID missing",
            "detail": "An application reference is required for tracking.",
        })
    if not file_names:
        findings.append({
            "severity": "medium",
            "title": "No supporting documents uploaded",
            "detail": "Upload sample supporting documents for the officer to review.",
        })
    if faculty_count <= 0:
        findings.append({
            "severity": "medium",
            "title": "Faculty count needs review",
            "detail": "The entered faculty count is zero or missing. Confirm it against the institution's records.",
        })
    if lab_count <= 0:
        findings.append({
            "severity": "medium",
            "title": "Laboratory evidence needs review",
            "detail": "No laboratories were recorded. Confirm whether this is appropriate for the application type.",
        })
    if equipment_count < 0:
        findings.append({
            "severity": "high",
            "title": "Invalid equipment count",
            "detail": "Equipment count cannot be negative.",
        })

    if not findings:
        findings.append({
            "severity": "low",
            "title": "Initial completeness check passed",
            "detail": "Basic fields are present. This does not establish document authenticity or regulatory compliance.",
        })

    return {
        "application_id": application_id,
        "institution_name": institution_name,
        "status": "Needs officer review" if any(f["severity"] in ("high", "medium") for f in findings) else "Initial checks complete",
        "uploaded_documents": file_names,
        "summary": f"Received {len(file_names)} document(s). {len(findings)} initial finding(s) generated.",
        "findings": findings,
        "disclaimer": "Prototype output only. No official issuer verification, OCR authenticity check, or regulatory approval has been performed. A qualified officer must review evidence and applicable official rules.",
    }

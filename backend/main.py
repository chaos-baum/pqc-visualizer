import oqs
import base64
import binascii
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Set


SUPPORTED_ALGORITHMS: Set[str] = set()

app = FastAPI(
    title="PQC Visualizer API",
    description="A simple API for pqc operations",
    version="2.3.0",
)


@app.on_event("startup")
def populate_algorithms_cache():
    global SUPPORTED_ALGORITHMS
    SUPPORTED_ALGORITHMS = set(oqs.get_enabled_kem_mechanisms())
    print(f"Server started. {len(SUPPORTED_ALGORITHMS)} KEM algorithms supported.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class KeypairRequest(BaseModel):
    algorithm: str


class EncapRequest(BaseModel):
    algorithm: str
    publicKey: str


class DecapRequest(BaseModel):
    algorithm: str
    ciphertext: str
    secretKey: str


def to_base64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def from_base64(data: str) -> bytes:
    try:
        return base64.b64decode(data, validate=True)
    except (ValueError, binascii.Error):
        raise HTTPException(status_code=400, detail="Invalid Base64 encoding.")


def validate_algorithm(alg: str):
    if alg not in SUPPORTED_ALGORITHMS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or unsupported algorithm: '{alg}'",
        )


@app.get("/api/algorithms", tags=["Algorithmen"])
def get_supported_algorithms():
    return {"algorithms": sorted(list(SUPPORTED_ALGORITHMS))}


@app.post("/api/keypair", tags=["KEM-Operationen"])
def generate_keypair(req: KeypairRequest):
    validate_algorithm(req.algorithm)
    with oqs.KeyEncapsulation(req.algorithm) as kem:
        public_key = kem.generate_keypair()
        secret_key = kem.export_secret_key()
    return {
        "publicKey": to_base64(public_key),
        "secretKey": to_base64(secret_key),
    }


@app.post("/api/encap", tags=["KEM-Operationen"])
def encapsulate_secret(req: EncapRequest):
    validate_algorithm(req.algorithm)
    public_key = from_base64(req.publicKey)
    with oqs.KeyEncapsulation(req.algorithm) as kem:
        ciphertext, shared_secret = kem.encap_secret(public_key)
    return {
        "ciphertext": to_base64(ciphertext),
        "sharedSecret": to_base64(shared_secret),
    }


@app.post("/api/decap", tags=["KEM-Operationen"])
def decapsulate_secret(req: DecapRequest):
    validate_algorithm(req.algorithm)
    ciphertext = from_base64(req.ciphertext)
    secret_key = from_base64(req.secretKey)

    try:
        with oqs.KeyEncapsulation(req.algorithm, secret_key) as kem:
            shared_secret = kem.decap_secret(ciphertext)
        return {"sharedSecret": to_base64(shared_secret)}
    except oqs.Error as e:
        raise HTTPException(
            status_code=400,
            detail=f"Decapsulation failed. The ciphertext may be invalid. Error: {e}",
        )

import pytest
import requests

BASE_URL = "http://127.0.0.1:7888"


def test_api_is_online():
    try:
        response = requests.get(BASE_URL + "/docs")
        assert response.status_code == 200
    except requests.exceptions.ConnectionError:
        pytest.fail(f"Can't reach API at {BASE_URL}.")


def test_get_algorithms():
    response = requests.get(BASE_URL + "/api/algorithms")
    assert response.status_code == 200
    data = response.json()
    assert "algorithms" in data
    assert isinstance(data["algorithms"], list)
    assert len(data["algorithms"]) > 0


@pytest.mark.parametrize(
    "algorithm",
    [
        "BIKE-L1",
        "BIKE-L3",
        "BIKE-L5",
        "Classic-McEliece-348864",
        "Classic-McEliece-348864f",
        "Classic-McEliece-460896",
        "Classic-McEliece-460896f",
        "Classic-McEliece-6688128",
        "Classic-McEliece-6688128f",
        "Classic-McEliece-6960119",
        "Classic-McEliece-6960119f",
        "Classic-McEliece-8192128",
        "Classic-McEliece-8192128f",
        "HQC-128",
        "HQC-192",
        "HQC-256",
    ],
)
def test_full_kem_cycle(algorithm):
    keypair_req = {"algorithm": algorithm}
    response = requests.post(BASE_URL + "/api/keypair", json=keypair_req)
    assert response.status_code == 200, f"Keypair error: {response.text}"
    keys = response.json()
    assert "publicKey" in keys
    assert "secretKey" in keys

    encap_req = {"algorithm": algorithm, "publicKey": keys["publicKey"]}
    response = requests.post(BASE_URL + "/api/encap", json=encap_req)
    assert response.status_code == 200, f"Encap error: {response.text}"
    encap_data = response.json()
    assert "ciphertext" in encap_data
    assert "sharedSecret" in encap_data
    shared_secret_1 = encap_data["sharedSecret"]

    decap_req = {
        "algorithm": algorithm,
        "ciphertext": encap_data["ciphertext"],
        "secretKey": keys["secretKey"],
    }
    response = requests.post(BASE_URL + "/api/decap", json=decap_req)
    assert response.status_code == 200, f"Decap error: {response.text}"
    decap_data = response.json()
    shared_secret_2 = decap_data["sharedSecret"]

    assert shared_secret_1 == shared_secret_2


def test_invalid_algorithm_request():
    invalid_algorithm = "123"
    keypair_req = {"algorithm": invalid_algorithm}
    response = requests.post(BASE_URL + "/api/keypair", json=keypair_req)

    assert response.status_code == 400
    error_data = response.json()
    assert "detail" in error_data
    assert invalid_algorithm in error_data["detail"]


def test_decap_with_wrong_secret_key():
    """Testet, ob die Entkapselung mit einem falschen SK fehlschlägt."""
    algorithm = "Kyber512"

    keys_a_resp = requests.post(
        BASE_URL + "/api/keypair", json={"algorithm": algorithm}
    )
    keys_a = keys_a_resp.json()

    keys_b_resp = requests.post(
        BASE_URL + "/api/keypair", json={"algorithm": algorithm}
    )
    keys_b = keys_b_resp.json()

    encap_req = {"algorithm": algorithm, "publicKey": keys_a["publicKey"]}
    encap_resp = requests.post(BASE_URL + "/api/encap", json=encap_req)
    encap_data = encap_resp.json()
    original_shared_secret = encap_data["sharedSecret"]

    decap_req = {
        "algorithm": algorithm,
        "ciphertext": encap_data["ciphertext"],
        "secretKey": keys_b["secretKey"], 
    }
    decap_resp = requests.post(BASE_URL + "/api/decap", json=decap_req)
    wrong_shared_secret = decap_resp.json()["sharedSecret"]


    assert original_shared_secret != wrong_shared_secret


def test_invalid_json_data_type():
    """Testet die Reaktion der API auf falsche Datentypen."""
    encap_req = {
        "algorithm": "Kyber512",
        "publicKey": 123456789, 
    }
    response = requests.post(BASE_URL + "/api/encap", json=encap_req)
    assert response.status_code == 422 


def test_malformed_base64_input():
    """Testet die Reaktion der API auf einen ungültigen Base64-String."""
    encap_req = {
        "algorithm": "Kyber512",
        "publicKey": "dies-ist-kein-gueltiger-base64-string-!@#",
    }
    response = requests.post(BASE_URL + "/api/encap", json=encap_req)
    assert response.status_code >= 400 and response.status_code < 500

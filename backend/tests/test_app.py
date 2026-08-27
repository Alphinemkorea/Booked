from app import app


@app.route("/boom")
def boom():
    raise RuntimeError("intentional failure")


def test_home():
    client = app.test_client()
    response = client.get("/")

    assert response.status_code == 200
    assert response.json["message"] == "Booked API is running!"


def test_unknown_route_returns_json_404():
    client = app.test_client()
    response = client.get("/definitely-missing-route")

    assert response.status_code == 404
    assert response.is_json
    assert response.json["error"] == "Not Found"


def test_options_preflight_includes_cors_headers():
    client = app.test_client()
    response = client.options(
        "/",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )

    assert response.status_code == 204
    assert response.headers.get("Access-Control-Allow-Origin") in {"http://localhost:5173", "*"}
    assert "Access-Control-Allow-Methods" in response.headers


def test_unhandled_exception_returns_json_error():
    client = app.test_client()
    response = client.get("/boom")

    assert response.status_code == 500
    assert response.is_json
    assert response.json["error"] == "Internal Server Error"


def test_login_and_admin_user_management():
    client = app.test_client()

    login_res = client.post(
        "/api/auth/login",
        json={"email": "admin@booked.local", "password": "admin123"},
    )
    assert login_res.status_code == 200
    token = login_res.json["access_token"]
    assert token

    admin_list = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert admin_list.status_code == 200
    assert isinstance(admin_list.json["users"], list)
    assert len(admin_list.json["users"]) >= 2

    created = client.post(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"email": "newuser@example.com", "password": "secret123", "name": "New User", "role": "user"},
    )
    assert created.status_code == 201
    user_id = created.json["user"]["id"]

    read_user = client.get(
        f"/api/admin/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert read_user.status_code == 200

    updated = client.put(
        f"/api/admin/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Updated User", "role": "admin"},
    )
    assert updated.status_code == 200
    assert updated.json["user"]["name"] == "Updated User"

    quick = client.post(
        f"/api/admin/users/{user_id}/quick-action",
        headers={"Authorization": f"Bearer {token}"},
        json={"action": "toggle_active"},
    )
    assert quick.status_code == 200
    assert quick.json["user"]["active"] is False

    deleted = client.delete(
        f"/api/admin/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert deleted.status_code == 200
    assert deleted.json["deleted"] is True


def test_non_admin_cannot_access_admin_routes():
    client = app.test_client()
    login_res = client.post(
        "/api/auth/login",
        json={"email": "user@booked.local", "password": "user123"},
    )
    token = login_res.json["access_token"]

    response = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
    assert response.json["error"] == "Admin access required"


def test_missing_token_is_rejected_on_protected_route():
    client = app.test_client()
    response = client.get("/api/auth/me")
    assert response.status_code == 401

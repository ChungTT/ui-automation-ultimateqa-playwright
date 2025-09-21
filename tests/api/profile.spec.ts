import { test, expect } from "@playwright/test";
import { validateWithSchema } from "../../utils/validateSchema";

const CREATE_SCHEMA = "schemas/createProfile.schema.json";
const GET_SCHEMA = "schemas/getProfile.schema.json";

test.describe("Profile API", () => {
  test("Create and retrieve profile successfully", async ({ request }) => {
    const newProfile = {
      username: `user_${Date.now()}`,
      dateOfBirth: new Date().toISOString(),
      gender: "MALE",                  // có thể bỏ hoặc để null nếu muốn
      subscribedMarketing: true,       // có thể bỏ hoặc để null nếu muốn
      // hasSetupPreference: null,     // tuỳ chọn
    };

    // POST
    const createRes = await request.post("/v1/profile", { data: newProfile });
    const createText = await createRes.text();
    expect(
      createRes.status(),
      `POST /v1/profile failed. Status=${createRes.status()} Body=${createText}`
    ).toBe(201);

    let createJson: any;
    try {
      createJson = JSON.parse(createText);
    } catch {
      throw new Error(`POST did not return JSON. Body=${createText}`);
    }

    // Validate theo schema mới (bắt buộc: userId, username, dateOfBirth)
    validateWithSchema(CREATE_SCHEMA, createJson);

    const userId = createJson?.userId;
    expect(
      userId,
      `POST body missing 'userId'. Body=${JSON.stringify(createJson)}`
    ).toBeTruthy();

    // GET
    const getRes = await request.get(`/v1/profile/${userId}`);
    const getText = await getRes.text();

    if (!getRes.ok()) {
      throw new Error(
        `GET /v1/profile/${userId} not ok. Status=${getRes.status()} Body=${getText}`
      );
    }
    expect(getRes.status()).toBe(200);

    let profileJson: any;
    try {
      profileJson = JSON.parse(getText);
    } catch {
      throw new Error(`GET did not return JSON. Body=${getText}`);
    }

    // Validate theo schema GET (giống schema POST bạn gửi)
    validateWithSchema(GET_SCHEMA, profileJson);

    // Sanity checks (tuỳ chọn theo nghiệp vụ của bạn)
    expect(profileJson.userId).toBe(userId);
    expect(profileJson.username).toBe(newProfile.username);
    expect(profileJson.dateOfBirth).toBe(newProfile.dateOfBirth);
    if (newProfile.gender !== undefined)
      expect(profileJson.gender).toBe(newProfile.gender);
    if (newProfile.subscribedMarketing !== undefined)
      expect(profileJson.subscribedMarketing).toBe(true);
    // hasSetupPreference là optional, có thể undefined hoặc null nên không assert cứng
  });

  test("Fail when missing required fields", async ({ request }) => {
    // thiếu username & dateOfBirth -> 400
    const badProfile = { gender: "MALE" };
    const res = await request.post("/v1/profile", { data: badProfile });
    const text = await res.text();
    expect(
      res.status(),
      `Expected 400 for bad body; got ${res.status()} Body=${text}`
    ).toBe(400);
  });
});

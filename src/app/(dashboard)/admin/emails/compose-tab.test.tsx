// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const sendCampaignEmail = vi.fn();
const sendTestCampaignEmail = vi.fn();
vi.mock("./actions", () => ({
  sendCampaignEmail: (...a: unknown[]) => sendCampaignEmail(...a),
  sendTestCampaignEmail: (...a: unknown[]) => sendTestCampaignEmail(...a),
  loadRecipientData: async () => ({ courses: [], cohorts: [], students: [], enrolledByCourse: {}, membersByCohort: {} }),
}));
vi.mock("@/components/admin/rich-editor", () => ({ RichEditor: () => <div>Formatted editor</div> }));
vi.mock("../forms/email-actions", () => ({ sendDesignedTest: vi.fn() }));

import { ComposeTab } from "./compose-tab";

beforeEach(() => {
  sendCampaignEmail.mockReset();
  sendCampaignEmail.mockResolvedValue({ error: null, sent: 1, failed: 0, results: [] });
  sendTestCampaignEmail.mockReset();
  sendTestCampaignEmail.mockResolvedValue({ error: null, ok: true, detail: "Sent to owner@example.com." });
});

describe("ComposeTab", () => {
  it("has a clear Simple message | Designed email (HTML) switch, and sends the designed email cleaned", async () => {
    render(<ComposeTab v2 adminEmail="owner@example.com" templates={[]} initialTo={["aanya.rao@example.com"]} />);
    expect(screen.getByRole("radio", { name: "Simple message" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Formatted editor")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Designed email (HTML)" }));
    expect(screen.queryByText("Formatted editor")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hi {{first_name}}" } });
    fireEvent.change(screen.getByLabelText("HTML"), { target: { value: `<p onclick="x()">Hello {{first_name}}</p><script>1</script>` } });
    expect(screen.getByText(/Taken out before sending: 1 script, 1 event handler/)).toBeInTheDocument();
    const frame = screen.getByTitle("Email preview");
    expect(frame.getAttribute("sandbox")).toBe("");
    expect(frame.getAttribute("srcdoc")).toContain("<p>Hello Aanya</p>");
    expect(screen.getByText("Hi Aanya")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Send test to me/ }));
    await waitFor(() => expect(sendTestCampaignEmail).toHaveBeenCalledTimes(1));
    expect(sendTestCampaignEmail.mock.calls[0][0]).toMatchObject({ sampleEmail: "aanya.rao@example.com", designed: { text: null } });

    fireEvent.click(screen.getByRole("button", { name: "Send to 1" }));
    expect(sendCampaignEmail).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: "Send to 1 recipient" }));
    await waitFor(() => expect(sendCampaignEmail).toHaveBeenCalledTimes(1));
    const arg = sendCampaignEmail.mock.calls[0][0] as { designed: { html: string }; recipientEmails: string[] };
    expect(arg.recipientEmails).toEqual(["aanya.rao@example.com"]);
    expect(arg.designed.html).toContain("Hello {{first_name}}");
    expect(arg.designed.html).not.toMatch(/script|onclick/);

    fireEvent.click(screen.getByRole("radio", { name: "Simple message" }));
    expect(screen.getByText("Formatted editor")).toBeInTheDocument();
  });
});

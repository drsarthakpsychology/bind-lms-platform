// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const sendDesignedTest = vi.fn();
vi.mock("./email-actions", () => ({ sendDesignedTest: (...a: unknown[]) => sendDesignedTest(...a) }));

import { EmailCompose } from "./email-compose";
import type { PersonalReport } from "@/lib/email/personal";

const ok: PersonalReport = { error: null, sent: ["Aanya Rao", "Dev Shah"], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 10, queueFailed: false };
const onSend = vi.fn<(subject: string, body: string, designed?: { html: string; text?: string | null }) => Promise<PersonalReport>>();

function show() {
  return render(
    <EmailCompose
      open
      onOpenChange={() => {}}
      recipients={[
        { key: "s1", name: "Aanya Rao", email: "aanya@example.com" },
        { key: "s2", name: "Dev Shah", email: "dev@example.com" },
      ]}
      allowance={{ configured: true, limit: 100, left: 100 }}
      onSend={onSend}
    />,
  );
}

beforeEach(() => {
  onSend.mockReset();
  onSend.mockResolvedValue(ok);
  sendDesignedTest.mockReset();
  sendDesignedTest.mockResolvedValue({ error: null, to: "owner@example.com" });
});

describe("EmailCompose designed mode", () => {
  it("switches between plain and designed, keeping the plain email as it was", () => {
    show();
    expect(screen.getByRole("radio", { name: "Plain email" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Designed email (HTML)" }));
    expect(screen.getByRole("radio", { name: "Designed email (HTML)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.getByLabelText("HTML")).toBeInTheDocument();
    expect(screen.getByLabelText("Plain-text version (optional)")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Plain email" }));
    expect(screen.getByLabelText("Email")).toHaveValue("Hi {first_name},\n\n");
  });

  it("previews only in a sandboxed frame, says what was taken out, and confirms the count before sending", async () => {
    show();
    fireEvent.click(screen.getByRole("radio", { name: "Designed email (HTML)" }));
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hello {{first_name}}" } });
    fireEvent.change(screen.getByLabelText("HTML"), { target: { value: `<p style="color:red" onclick="x()">Hi {{first_name}}</p><script>alert(1)</script>` } });

    expect(screen.getByText(/Taken out before sending: 1 script, 1 event handler/)).toBeInTheDocument();
    const frame = screen.getByTitle("Email preview");
    expect(frame.getAttribute("sandbox")).toBe("");
    const doc = frame.getAttribute("srcdoc") ?? "";
    expect(doc).toContain('<p style="color:red">Hi Aanya</p>');
    expect(doc).not.toMatch(/<script|onclick/);
    expect(screen.getByText("Hello Aanya")).toBeInTheDocument();
    // The pasted HTML never becomes part of the admin page itself.
    expect(document.querySelector("p[style='color:red']")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: "Desktop" }));
    expect(screen.getByTitle("Email preview").className).toMatch(/min-w-\[640px\]/);

    fireEvent.click(screen.getByRole("button", { name: "Send a test to me" }));
    await waitFor(() => expect(screen.getByText("Test sent to owner@example.com.")).toBeInTheDocument());
    expect(sendDesignedTest.mock.calls[0][0]).toMatchObject({ subject: "Hello {{first_name}}", sample: { name: "Aanya Rao" } });
    expect(onSend).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Send to 2" }));
    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByText(/Send this designed email to 2 people\?/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Yes, send to 2" }));
    await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1));
    const [subject, , designed] = onSend.mock.calls[0];
    expect(subject).toBe("Hello {{first_name}}");
    expect(designed?.html).toContain("Hi {{first_name}}");
    expect(designed?.html).not.toMatch(/script/);
    expect(designed?.text).toBeNull();
    await waitFor(() => expect(screen.getByText("What happened")).toBeInTheDocument());
  });

  it("will not send HTML that is too big", () => {
    show();
    fireEvent.click(screen.getByRole("radio", { name: "Designed email (HTML)" }));
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Hi" } });
    fireEvent.change(screen.getByLabelText("HTML"), { target: { value: `<p>${"a".repeat(410 * 1024)}</p>` } });
    expect(screen.getByText(/The most is 400 KB/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send to 2" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send a test to me" })).toBeDisabled();
  });
});

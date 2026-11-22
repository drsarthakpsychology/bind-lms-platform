import { describe, expect, it } from "vitest";
import { decideHost } from "./canonical-host";

describe("decideHost", () => {
  it("leaves the real address alone", () => {
    expect(decideHost({ host: "vibhapsychology.com", pathname: "/" })).toEqual({ action: "none" });
    expect(decideHost({ host: "VIBHAPSYCHOLOGY.COM:443", pathname: "/free" })).toEqual({ action: "none" });
  });

  it("leaves local development alone", () => {
    for (const host of ["localhost:3000", "127.0.0.1:3100", "192.168.1.4:3000", "", null]) {
      expect(decideHost({ host, pathname: "/" })).toEqual({ action: "none" });
    }
  });

  it("redirects the old Vercel address with path and query kept", () => {
    expect(
      decideHost({ host: "bind-lms-platform.vercel.app", pathname: "/free/help", search: "?a=1" }),
    ).toEqual({ action: "redirect", location: "https://vibhapsychology.com/free/help?a=1" });
  });

  it("redirects www", () => {
    expect(decideHost({ host: "www.vibhapsychology.com", pathname: "/" })).toEqual({
      action: "redirect",
      location: "https://vibhapsychology.com/",
    });
  });

  it("never redirects the app API, crons or webhooks", () => {
    for (const pathname of ["/api/app/v1/me", "/api/cron/standing", "/api"]) {
      expect(decideHost({ host: "bind-lms-platform.vercel.app", pathname })).toEqual({ action: "noindex" });
    }
  });

  it("never redirects sign-in callbacks", () => {
    expect(decideHost({ host: "bind-lms-platform.vercel.app", pathname: "/auth/callback", search: "?code=x" })).toEqual({
      action: "noindex",
    });
  });

  it("never redirects form posts", () => {
    expect(decideHost({ host: "bind-lms-platform.vercel.app", pathname: "/waitlist", method: "POST" })).toEqual({
      action: "noindex",
    });
    expect(decideHost({ host: "bind-lms-platform.vercel.app", pathname: "/", method: "HEAD" }).action).toBe("redirect");
  });

  it("marks preview and unknown hosts noindex without redirecting", () => {
    expect(decideHost({ host: "bind-lms-platform-git-x-team.vercel.app", pathname: "/" })).toEqual({ action: "noindex" });
    expect(decideHost({ host: "example.org", pathname: "/" })).toEqual({ action: "noindex" });
  });
});

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Public certificate verification page — the QR code on a certificate points
 * here. No auth required (it's a public proof page). Shows the student + course
 * from the certificate record if it exists.
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("id, student_name, course_title, issued_at")
    .eq("id", certificateId)
    .maybeSingle();

  if (!cert) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-h1">Certificate not found</p>
            <p className="mt-2 text-small text-muted-foreground">
              This certificate could not be verified. Check the link or contact the administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <Card className="w-full max-w-md hard-shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Certificate of Completion</CardTitle>
          <div className="flex justify-center">
            <Badge variant="success">Verified ✓</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">This certifies that</p>
          <p className="text-h2">{cert.student_name}</p>
          <p className="text-sm text-muted-foreground">successfully completed</p>
          <p className="text-h3">{cert.course_title}</p>
          <p className="text-caption text-muted-foreground">
            Issued {new Date(cert.issued_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

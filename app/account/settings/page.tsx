"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useQuery(api.projects.getProfile);
  const updateProfile = useMutation(api.projects.updateProfile);
  const deleteAccount = useAction(api.account.deleteAccount);
  const { signOut } = useAuthActions();

  const [fullName, setFullName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Use local state if edited, otherwise profile value
  const displayName = fullName ?? profile?.fullName ?? "";

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ fullName: displayName });
      setFullName(null);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.push("/");
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Settings</h1>

      {/* Profile section */}
      <section className="mt-8">
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account details.
        </p>

        <div className="mt-4 space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="fullName">Name</Label>
            <Input
              id="fullName"
              value={displayName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email ?? ""}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || fullName === null}
            size="sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Password section */}
      <section>
        <h2 className="text-lg font-medium">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          To change your password, sign out and use &ldquo;Forgot password&rdquo; on the login page.
        </p>
      </section>

      <Separator className="my-8" />

      {/* Danger zone */}
      <section>
        <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="mt-4">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account, all projects, scopes,
                photos, and documents. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Yes, delete everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}

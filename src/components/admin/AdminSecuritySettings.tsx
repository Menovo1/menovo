import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import { addAdminUser, changeAdminPassword } from "@/lib/admin.functions";
import { AdminButton, AdminCard, inputCls, labelCls } from "@/components/admin/ui";

export function AdminSecuritySettings() {
  // Add Admin State
  const runAddAdmin = useServerFn(addAdminUser);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");
  const [addError, setAddError] = useState("");

  // Password Change State
  const runChangePassword = useServerFn(changeAdminPassword);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passNew, setPassNew] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [passBusy, setPassBusy] = useState(false);
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addBusy) return;
    setAddBusy(true);
    setAddSuccess("");
    setAddError("");

    try {
      const res = await runAddAdmin({
        data: {
          email: newEmail,
          password: newPassword,
          fullName: newName,
        },
      });
      if (res.ok) {
        setAddSuccess(`Successfully registered new admin account: ${res.email}`);
        setNewEmail("");
        setNewPassword("");
        setNewName("");
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add admin user.");
    } finally {
      setAddBusy(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passBusy) return;
    if (passNew !== passConfirm) {
      setPassError("New Password and Confirm New Password do not match.");
      return;
    }
    setPassBusy(true);
    setPassSuccess("");
    setPassError("");

    try {
      const res = await runChangePassword({
        data: {
          currentPassword,
          newPassword: passNew,
          confirmPassword: passConfirm,
        },
      });
      if (res.ok) {
        setPassSuccess("Your admin password was updated successfully!");
        setCurrentPassword("");
        setPassNew("");
        setPassConfirm("");
      }
    } catch (err) {
      setPassError(err instanceof Error ? err.message : "Password change failed.");
    } finally {
      setPassBusy(false);
    }
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      {/* ADD ANOTHER ADMIN */}
      <AdminCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/20 text-gold">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg text-white">Add Another Administrator</h3>
            <p className="text-xs text-white/50">Create a separate, real account for a new admin user.</p>
          </div>
        </div>

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Co-Administrator"
              className={inputCls}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Admin Email Address *</label>
            <input
              type="email"
              required
              placeholder="admin2@menovo.app"
              className={inputCls}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Secure Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className={inputCls}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {addError && <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{addError}</p>}
          {addSuccess && (
            <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> {addSuccess}
            </p>
          )}

          <AdminButton type="submit" disabled={addBusy} className="w-full py-3">
            {addBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Admin Account"}
          </AdminButton>
        </form>
      </AdminCard>

      {/* CHANGE ADMIN PASSWORD */}
      <AdminCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/20 text-gold">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg text-white">Change Admin Password</h3>
            <p className="text-xs text-white/50">Update your current account login credentials.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className={labelCls}>Current Password *</label>
            <input
              type="password"
              required
              placeholder="Enter your current password"
              className={inputCls}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Enter new password"
              className={inputCls}
              value={passNew}
              onChange={(e) => setPassNew(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Confirm New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              className={inputCls}
              value={passConfirm}
              onChange={(e) => setPassConfirm(e.target.value)}
            />
          </div>

          {passError && <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">{passError}</p>}
          {passSuccess && (
            <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> {passSuccess}
            </p>
          )}

          <AdminButton type="submit" disabled={passBusy} className="w-full py-3">
            {passBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}

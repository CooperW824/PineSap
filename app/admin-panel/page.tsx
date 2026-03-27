import AdminClubNameEditor from "../components/admin-club-name-editor";
import AdminProjectList from "../components/admin-project-list";

export default function AdminSettingsClient() {
  return (
    <main className="min-h-screen w-full p-6 bg-base-100 text-base-content">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <AdminClubNameEditor />

      <hr className="my-6 border-border-300 border-base-300" />

      <AdminProjectList />
    </main>
  );
}

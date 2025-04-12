"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleSwitchModal from "./RoleSwitchModal";

export default function RoleSwitchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState<"candidate" | "recruiter">(
    "candidate"
  );
  const [targetRole, setTargetRole] = useState<"candidate" | "recruiter">(
    "recruiter"
  );
  const [targetPath, setTargetPath] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for role-switch params in the URL
    const shouldSwitch = searchParams.get("role-switch");
    const currRole = searchParams.get("current-role") as
      | "candidate"
      | "recruiter";
    const tgtRole = searchParams.get("target-role") as
      | "candidate"
      | "recruiter";
    const tgtPath = searchParams.get("target-path");

    if (shouldSwitch === "true" && currRole && tgtRole && tgtPath) {
      setCurrentRole(currRole);
      setTargetRole(tgtRole);
      setTargetPath(decodeURIComponent(tgtPath));
      setShowModal(true);

      // Remove the params from the URL without page reload
      const params = new URLSearchParams(window.location.search);
      params.delete("role-switch");
      params.delete("current-role");
      params.delete("target-role");
      params.delete("target-path");

      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {children}
      {showModal && (
        <RoleSwitchModal
          currentRole={currentRole}
          targetRole={targetRole}
          targetPath={targetPath}
          onClose={handleClose}
        />
      )}
    </>
  );
}

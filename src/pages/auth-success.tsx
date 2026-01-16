import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createSession, getAccount } from "../lib/auth";

const AuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const requestToken = params.get("request_token");
    if (!requestToken) return;

    const handleAuth = async () => {
      try {
        const sessionId = await createSession(requestToken);
        const accountId = await getAccount(sessionId);

        localStorage.setItem("session_id", sessionId);
        localStorage.setItem("account_id", accountId.toString());

        console.log("LOGIN SUCCESS");
        console.log("SESSION:", sessionId);
        console.log("ACCOUNT:", accountId);

        // ⏩ redirect balik
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Auth failed", error);
      }
    };

    handleAuth();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p className="text-sm text-gray-300">Logging you in…</p>
    </div>
  );
};

export default AuthSuccess;

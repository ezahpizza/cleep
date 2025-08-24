interface UserInfo {
  id: string;
  email: string;
  created_at: string;
  isAuthenticated: boolean;
}

interface UserInfoDisplayProps {
  userInfo: UserInfo;
}

export function UserInfoDisplay({ userInfo }: UserInfoDisplayProps) {
  return (
    <div className="text-slate-300 space-y-2">
      <div className="text-emerald-400 font-bold">User Information:</div>
      <div className="ml-4 space-y-1">
        <div><span className="text-cyan-300">Email:</span> {userInfo.email}</div>
        <div><span className="text-cyan-300">ID:</span> {userInfo.id}</div>
        <div><span className="text-cyan-300">Created:</span> {new Date(userInfo.created_at).toLocaleDateString('en-GB')}</div>
      </div>
    </div>
  );
}

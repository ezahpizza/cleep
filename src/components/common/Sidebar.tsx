import React, { useState } from "react";
import {
  FiHome,
  FiUser,
  FiPlus,
  FiChevronsRight,
  FiArchive,
  FiTrash2,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiTerminal,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@supabase/supabase-js";
import { isUserAuthenticated } from "@/utils/authUtils";

interface SidebarProps {
  onCommand: (command: string) => void;
  user?: User | null;
  loading?: boolean;
}

export const Sidebar = ({ onCommand, user: propUser, loading: propLoading }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Terminal");
  const authState = useAuth();
  
  const user = propUser !== undefined ? propUser : authState.user;
  const loading = propLoading !== undefined ? propLoading : authState.loading;

  const isAuthenticated = isUserAuthenticated(user);

  return (
    <motion.nav
      layout
      className="rounder-lg sticky top-0 h-screen shrink-0 bg-indigo-400 p-2 custom-scrollbar z-50"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        {/* Always visible - work for everyone */}
        <Option
          Icon={FiTerminal}
          title="Terminal"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => onCommand("clear")}
        />
        <Option
          Icon={FiPlus}
          title="Create Note"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => onCommand("cr ")}
        />
        <Option
          Icon={FiHome}
          title="Home"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => onCommand("ls /home")}
        />
        <Option
          Icon={FiArchive}
          title="Archived"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => onCommand("ls /archived")}
        />
        <Option
          Icon={FiTrash2}
          title="Deleted"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => onCommand("ls /deleted")}
        />
        
        {loading ? (
          <div className="text-black text-xs p-2">Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Option
              Icon={FiUser}
              title="Profile"
              selected={selected}
              setSelected={setSelected}
              open={open}
              onClick={() => onCommand("whoami")}
            />
            <Option
              Icon={FiLogOut}
              title="Logout"
              selected={selected}
              setSelected={setSelected}
              open={open}
              onClick={() => onCommand("logout")}
            />
          </>
        ) : (
          <>
            <Option
              Icon={FiLogIn}
              title="Login"
              selected={selected}
              setSelected={setSelected}
              open={open}
              onClick={() => onCommand("login")}
            />
            <Option
              Icon={FiUserPlus}
              title="Signup"
              selected={selected}
              setSelected={setSelected}
              open={open}
              onClick={() => onCommand("signup")}
            />
          </>
        )}
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, onClick, notifs }: {
  Icon: React.ComponentType;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  onClick?: () => void;
  notifs?: number;
}) => {
  return (
    <motion.button
      layout
      onClick={() => {
        setSelected(title);
        onClick?.();
      }}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title ? "bg-indigo-100 text-indigo-800" : "text-black hover:bg-slate-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-md font-semibold">CLeep</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-12 shrink-0 place-content-center rounded-lg"
    >
      <img src="/imgs/pentacle.svg" alt="logo" className="size-10 rounded-lg" />
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium text-black"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

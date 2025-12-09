"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, HorizontaLDots } from "@/icons";
import { sidebarMenus, NavItem } from "@/config/sidebarMenus";
import { useSidebarTutorial } from "@/context/SidebarTutorial";

type AppLogoType = {
  light: string;
  dark: string;
};

type Props = {
  role: "admin" | "user" | "Tutorial";
  appLogo: AppLogoType;
};

const AppSidebar: React.FC<Props> = ({ role, appLogo }) => {
  const pathname = usePathname() || "";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoLink, setLogoLink] = useState("/home");

  const {
    isExpanded,
    isMobileOpen,
    setIsHovered,
    isHovered,
    toggleSidebar,
    toggleMobileSidebar,
    openSubmenu,
    toggleSubmenu
  } = useSidebarTutorial();

  // Cek status login dari localStorage
  useEffect(() => {
    const checkAuth = () => {
      // Cek berbagai kemungkinan key yang menyimpan auth
      const token = localStorage.getItem("authToken") || 
                    localStorage.getItem("token") ||
                    localStorage.getItem("accessToken") ||
                    localStorage.getItem("user");
      
      const isAuthenticated = !!token;
      setIsLoggedIn(isAuthenticated);
      
      // Set link berdasarkan status login
      if (isAuthenticated) {
        // Jika login, cek role untuk redirect yang sesuai
        if (role === "admin") {
          setLogoLink("/dashboard-admin");
        } else {
          setLogoLink("/dashboard-user");
        }
      } else {
        setLogoLink("/home");
      }
    };

    // Jalankan pengecekan saat component mount
    checkAuth();

    // Listen untuk perubahan localStorage (jika login/logout di tab lain)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "token" || e.key === "accessToken" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [role]);

  const menus = sidebarMenus[role];

  const isActive = (path?: string, name?: string) => {
    if (!path) return false;

    // Exact match dulu
    if (pathname === path) return true;

    // Untuk Overview → harus exact match saja
    if (name === "Beranda Pengguna") return false;

    // Untuk menu lain → cek nested path (harus ada / setelahnya)
    return pathname.startsWith(path + "/");
  };

  const renderNavItem = (item: NavItem) => {
    const hasSub = item.subItems && item.subItems.length > 0;

    const baseClass = `flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition`;
    const activeClass = item.path && isActive(item.path, item.name)
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-400";

    return (
      <li key={item.name} className="mb-1">
        {hasSub ? (
          // Parent menu dengan submenu (tanpa toggle)
          <div className={`${baseClass} ${activeClass} cursor-default`}>
            {item.icon}
            {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
          </div>
        ) : (
          // Menu tanpa submenu
          <Link href={item.path!} className={`${baseClass} ${activeClass}`}>
            {item.icon}
            {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
          </Link>
        )}

        {/* Submenu - SELALU TAMPIL saat sidebar terbuka */}
        {hasSub && (isExpanded || isHovered || isMobileOpen) && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.subItems!.map((sub) => (
              <li key={sub.name}>
                <Link
                  href={sub.path!}
                  className={`block px-3 py-1.5 rounded-lg text-sm ${
                    pathname === sub.path
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-500 dark:hover:bg-gray-800"
                  }`}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-15 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[100px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Header - Link berdasarkan status login */}
      <div className="flex items-left justify-between h-26 px-14 border-b dark:border-gray-800">
        <Link href={logoLink}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {appLogo.light && (
                <img
                  src={appLogo.light}
                  alt="Logo"
                  className="h-28 dark:hidden"
                />
              )}
              {appLogo.dark && (
                <img
                  src={appLogo.dark}
                  alt="Logo Dark"
                  className="h-28 hidden dark:block"
                />
              )}
            </>
          ) : (
            <img
              src="/catatin.png"
              alt="Logo Icon"
              className="h-28"
            />
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 mt-5">
          <div className="flex flex-col gap-4">
            <div>
              <ul>{menus.map(renderNavItem)}</ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
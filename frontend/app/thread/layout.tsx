"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/thread") {
      router.push("/search");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="relative h-full w-full flex justify-stretch items-stretch overflow-auto">
      {children}
    </div>
  );
};

export default Layout;

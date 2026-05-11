import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import {
  LayoutTemplate,
  MessageSquareQuote,
  HelpCircle,
  FileText,
  Users,
  MapPin,
  Settings,
  Tags
} from "lucide-react";

export default function ContentManagerPage() {
  const cmsSections = [
    {
      title: "Homepage Editor",
      description: "Edit hero text, how it works steps, featured vendors, and built on legacy section.",
      icon: LayoutTemplate,
      href: "/admin/content/homepage",
    },
    {
      title: "Testimonials",
      description: "Manage client quotes shown on homepage and for-couples pages.",
      icon: MessageSquareQuote,
      href: "/admin/content/testimonials",
    },
    {
      title: "FAQs",
      description: "Manage the FAQ accordion by category tabs.",
      icon: HelpCircle,
      href: "/admin/content/faqs",
    },
    {
      title: "Blog Posts",
      description: "Write and publish wedding planning blog articles.",
      icon: FileText,
      href: "/admin/content/blog",
    },
    {
      title: "Team Members",
      description: "Manage team bios and details for the about page.",
      icon: Users,
      href: "/admin/content/team",
    },
    {
      title: "Vendor Categories",
      description: "Manage category names, icons, and dynamic field schemas.",
      icon: Tags,
      href: "/admin/content/categories",
    },
    {
      title: "Service Cities",
      description: "Add or edit cities shown in all location dropdowns.",
      icon: MapPin,
      href: "/admin/content/cities",
    },
    {
      title: "Site Settings",
      description: "Edit contact info, social links, footer text, and SEO meta tags.",
      icon: Settings,
      href: "/admin/content/settings",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-playfair font-bold text-[#3D0C1A]">
          Content Manager (CMS)
        </h1>
        <p className="text-[#8a6200] max-w-3xl">
          Edit public-facing content without making code changes. All changes are reflected immediately.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cmsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="flex group focus:outline-none">
              <Card className="border border-[#dbb84a] bg-[#fffcf0] shadow-sm flex-1 transition-all group-hover:-translate-y-1 group-hover:shadow-md group-hover:shadow-[#C9940A]/20 group-focus-visible:ring-2 group-focus-visible:ring-[#C9940A]">
                <CardContent className="p-6 flex flex-col h-full items-start">
                  <div className="p-3 bg-[#fef3d6] rounded-xl mb-4 text-[#C9940A] group-hover:bg-[#C9940A] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3D0C1A] mb-2">{section.title}</h3>
                  <p className="text-sm text-[#5a3e00] leading-relaxed">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { Users, Search } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(9).fill(null);

  return (
    <aside className="flex flex-col h-full transition-all duration-200 border-r w-96 md:max-w-80 border-base-300">
      {/* Header */}
      <div className="w-full p-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Users className=" size-6" />
          <span className="font-medium">Contacts</span>
        </div>
        {/* Online Users Toggle*/}
        <div className="flex items-center gap-2 mt-3 ">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-sm" />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">(0 online)</span>
        </div>
        {/* Search Input */}
        <div className="relative mt-3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className=" size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            className="w-full pl-10 rounded-full input input-bordered input-md"
            placeholder="Start typing to find contacts..."
          />
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="w-full py-3 overflow-y-auto">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex items-center w-full gap-3 p-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="rounded-full skeleton size-12" />
            </div>

            {/* User info skeleton - only visible on large screens */}
            <div className="flex-1 block min-w-0 text-left">
              <div className="h-4 w-52 skeleton" />
              <div className="w-20 h-3 mt-1 skeleton" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;

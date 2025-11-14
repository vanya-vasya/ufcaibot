// DISABLED FOR LOCAL DESIGN WORK - Re-enable for production
// import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
  // DISABLED FOR LOCAL DESIGN WORK - Using mock user data
  // const { user } = useUser();
  const user = { firstName: 'Local', lastName: 'User', imageUrl: '' };
  
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
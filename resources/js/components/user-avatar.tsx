import type { User } from '@/types';
import { Avatar, AvatarProps } from '@heroui/react';

interface Props extends AvatarProps {
    user: User;
}

const getUserInitials = (user: User) => {
    const parts = user.name.trim().split(' ');

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (
        parts[0].charAt(0).toUpperCase() + parts.at(-1)!.charAt(0).toUpperCase()
    );
};

export default function UserAvatar(props: Props) {
    const { user, ...rest } = props;

    const initials = getUserInitials(user);

    return (
        <Avatar {...rest}>
            <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
    );
}

import { Link, type InertiaLinkProps } from '@inertiajs/react';
import { Button, type ButtonProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface LinkButtonProps extends Omit<ButtonProps, 'render' | 'children'> {
    href: NonNullable<InertiaLinkProps['href']>;
    children: ReactNode;
}

export default function LinkButton({ href, children, ...props }: LinkButtonProps) {
    return (
        <Button
            {...props}
            render={({ className }) => (
                <Link href={href} className={className}>
                    {children}
                </Link>
            )}
        />
    );
}

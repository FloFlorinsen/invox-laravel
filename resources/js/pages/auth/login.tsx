import { Form, Head } from '@inertiajs/react';
import {
    Button,
    FieldError,
    Input,
    InputGroup,
    Label,
    TextField,
} from '@heroui/react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { IconVisibility, IconVisibilityOff } from '@/icons';
import { store } from '@/routes/login';

export default function Login() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <Head title="Anmelden" />

            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-8">
                        <AppLogoIcon className="h-8 fill-current text-foreground" />

                        <h1 className="text-3xl font-bold tracking-tight">
                            Anmelden
                        </h1>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <TextField
                                    name="email"
                                    type="email"
                                    isRequired
                                    isInvalid={!!errors.email}
                                >
                                    <Label>E-Mail-Adresse</Label>
                                    <Input
                                        placeholder="email@example.com"
                                        autoFocus
                                        autoComplete="email"
                                    />
                                    <FieldError>{errors.email}</FieldError>
                                </TextField>

                                <TextField
                                    name="password"
                                    isRequired
                                    isInvalid={!!errors.password}
                                >
                                    <Label>Passwort</Label>
                                    <InputGroup>
                                        <InputGroup.Input
                                            type={
                                                isPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Passwort"
                                            autoComplete="current-password"
                                        />
                                        <InputGroup.Suffix>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="ghost"
                                                onPress={() =>
                                                    setIsPasswordVisible(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                aria-label={
                                                    isPasswordVisible
                                                        ? 'Passwort verbergen'
                                                        : 'Passwort anzeigen'
                                                }
                                            >
                                                {isPasswordVisible ? (
                                                    <IconVisibilityOff className="size-4" />
                                                ) : (
                                                    <IconVisibility className="size-4" />
                                                )}
                                            </Button>
                                        </InputGroup.Suffix>
                                    </InputGroup>
                                    <FieldError>{errors.password}</FieldError>
                                </TextField>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    isPending={processing}
                                    className="mt-2"
                                >
                                    Anmelden
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}

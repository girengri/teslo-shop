import { useContext } from "react";
import { useRouter } from "next/router";
import {
    Box,
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
import { CartContext } from "../../context";

type FormData = {
    firstname: string;
    lastname: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
};

const getAddressFromCookies = (): FormData => {
    return {
        firstname: Cookies.get("firstname") || "",
        lastname: Cookies.get("lastname") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        phone: Cookies.get("phone") || "",
    };
};

const AddressPage = () => {
    const router = useRouter();
    const { updateAddress } = useContext(CartContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: getAddressFromCookies(),
    });

    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push("/checkout/summary");
    };

    return (
        <ShopLayout
            title="Dirección"
            pageDescription="Confirmar dirección del destino"
        >
            <form onSubmit={handleSubmit(onSubmitAddress)}>
                <Typography variant="h1" component="h1">
                    Dirección
                </Typography>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            {...register("firstname", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.firstname}
                            helperText={errors.firstname?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            {...register("lastname", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.lastname}
                            helperText={errors.lastname?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Dirección"
                            variant="filled"
                            fullWidth
                            {...register("address", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Dirección 2 (opcional)"
                            variant="filled"
                            fullWidth
                            {...register("address2")}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Código Postal"
                            variant="filled"
                            fullWidth
                            {...register("zip", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            {...register("city", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                type="text"
                                select
                                variant="filled"
                                label="País"
                                defaultValue={Cookies.get("country") || countries[0].code}
                                {...register("country", {
                                    required: "Este campo es requerido",
                                })}
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.code} value={country.code}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="text"
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            {...register("phone", {
                                required: "Este campo es requerido",
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: 5 }} display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

export default AddressPage;

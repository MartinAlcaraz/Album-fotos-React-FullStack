import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import addUserIcon from '../icons/addUserIcon.svg';
import errorImg from '../icons/errorImg.svg';
import UserServices from '../services/UserServices';
import ModalLoading from '../components/ModalLoading';
import { useForm } from 'react-hook-form';

const AddUser = () => {

    const { register, handleSubmit, trigger, formState: { errors } } = useForm();

    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = React.useState(addUserIcon);
    const [loadingImg, setLoadingImg] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);


    React.useEffect(() => {
        async function getUsers() {
            let res = await UserServices.getUsers();
            setUsers(res);
        }
        getUsers();
    }, []);

    const onsubmit = async (data, e) => {
        //const newUser = { userName: data.nombre, image: data.selectedFile[0] };         
        const formData = new FormData()
        formData.append('userName', data.nombre);
        formData.append('image', data.selectedFile[0]);
        setShowLoading(true);   //  se muestra la animacion de loading
        const res = await UserServices.postUser(formData);

        if (res.data.saved) {
            setShowLoading(false);
            navigate("/");
        } else {
            setShowLoading(false);
            navigate("/404");
        }
    }

    async function cargarImagen(file) {
        // trigger comprueba los errores del input selecteFile  (es funcion asincrona )
        const archivoValido = await trigger("selectedFile");
        setSelectedImage(null);

        if (archivoValido) {
            setLoadingImg(true);
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function (event) {
                let imagen = event.target.result;
                setSelectedImage(imagen);
                setLoadingImg(false);
            }
        }
    }

    const addImage = (e) => {
        e.preventDefault();
        const inputFile = document.querySelector("#selectedFile");
        inputFile.click();
    }

    function nombreNoExiste(value) {
        
        for (let i = 0; i < users.length; i++) {
            if (users[i].userName.toLowerCase() == value.toLowerCase()) {
                return false;
            }
        }
        return true;
    }


    return (
        <div className='rounded-md bg-primary bg-secondary md:bg-secondary-md p-8 pt-2 m-2'>

            {
                showLoading ? <ModalLoading /> : <></>
            }

            <h2 className='mx-auto text-center text-2xl font-semibold'>Crear usuario</h2>
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col-reverse gap-4 items-center sm:flex-row">

                <div className="flex flex-col basis-1/2">

                    <input type='text' name="nombre" className="p-4 m-2 rounded-md" placeholder="Nombre de usuario"
                        {...register('nombre', {
                            required: "El nombre es requerido",
                            maxLength: { value: 10, message: "Nombre muy largo." },
                            minLength: { value: 2, message: "Nombre muy corto." },
                            pattern: { value: /^[A-Za-z]+$/, message: "No se permiten caracteres especiales" },
                            validate: {
                                nameExist: (value) => (nombreNoExiste(value)) || "El nombre de usuario ya existe."
                            }
                        })}
                    />
                    {
                        errors.nombre ? <div className='text-sm text-rose-500 text-center'>{errors.nombre.message}</div> : <></>
                    }
                    <input type="submit" className="button-primary" value="Agregar usuario" />
                </div>

                <div className="flex flex-col basis-1/2 w-full">
                    <div className="relative h-[50vh] sm:w-[50vw] ">
                        <div className='h-full w-full absolute m-auto'>
                            {loadingImg ? <Loading /> : (errors.selectedFile ? <img src={errorImg} className=" h-40 w-40 m-auto mt-[10%]" /> : <img src={selectedImage} className='object-contain w-full h-full' />)}
                        </div>

                        <input type='file' name="img" id="selectedFile" className="w-full h-full p-4 basis-1/2 absolute top-0 left-0 opacity-0 cursor-pointer"
                            accept="image/jpeg, image/png"
                            {...register("selectedFile", {
                                required: "Seleccione una imagen de perfil.",
                                validate: {
                                    size: (value) => (value[0].size / 1024 < 2048) || "La imagen debe pesar menos de 2MB",
                                    tipo: (value) => (["image/jpg", "image/jpeg", "image/png"].includes(value[0].type)) || "Elija otra imagen (.jpg, .jpeg ó .png)"
                                },
                                onChange: (value) => cargarImagen(value.target.files[0])
                            })}
                        />
                    </div>
                    {
                        <div className='text-sm h-4 text-rose-500 text-center'>{errors.selectedFile ? errors.selectedFile.message : ''}</div>
                    }
                    <button className="button-primary" onClick={addImage}>Agregar imagen de perfil</button>
                </div>
            </form>
        </div>
    )
}

export default AddUser;
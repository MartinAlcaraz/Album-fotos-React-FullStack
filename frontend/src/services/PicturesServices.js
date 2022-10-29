import axios from "axios";

//const URI = '/api/pictures';                //  si estamos en un servidor para produccion se deja asi   = '/api/pictures'
const URI = 'http://localhost:3000/api/pictures';     //  si estamos en desarrollo en el localhost

const pictureServices = {};

pictureServices.postPicture = async ( newPictureOfUser ) => {
    const res = await axios.post( URI, newPictureOfUser );
    return res;
}

pictureServices.getPictures = async (userId) => {   // retorna un arreglo de las imagenes de un usuario

    const response = await axios.get(`${URI}/${userId}`);
    return response;
}

// pictureServices.getOnePicture = async (userId) => {   // retorna una sola imagen
//     const response = await axios.get(`${URI}/${userId}`);
//     const user = await response.data.user;
//     return user;
//}

// pictureServices.deletePicture = async (pictureId) => {
//     const res = await axios.delete(`${URI}/${pictureId}`);
//     const data = res.data;
//     return data;
// }

export default pictureServices;
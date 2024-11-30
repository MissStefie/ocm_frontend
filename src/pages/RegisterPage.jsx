import React, { useState } from "react";
import axios from "axios";
import Flyer from "../assets/images/flyer_ocm.png";
import MuniLogo from "../assets/images/logo_muni.png";
import OCMLogo from "../assets/images/ocm_logo.png";
import { Instagram, Facebook, Person, Mail, Phone } from "@mui/icons-material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "../styles/RegisterPageStyle.css";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre ingresado es inválido"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo es obligatorio")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "El correo debe ser de dominio gmail.com"
    ),
  tel: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  num_people: Yup.number()
    .required("La cantidad de personas es obligatoria")
    .min(1, "Debe ser al menos 1")
    .max(5, "No puede ser más de 5 personas"),
});

export default function RegisterPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  console.log("ENV:", import.meta.env);
  const urlBackend = import.meta.env.VITE_API_URL;
  console.log(`Esta es la URL del backend: ${urlBackend}`);

  const handleSubmit = async (values) => {
    setFormData(values);
    setIsModalOpen(true);
  };

  const confirmRegistration = async () => {
    setIsProcessing(true);

    const { name, email, tel, num_people } = formData;
    const registerData = { name, email, tel, num_people };

    const urlBackendPOST = `${import.meta.env.VITE_API_URL}/register`;
    console.log(`Esta es la URL del backend haciendo POST: ${urlBackendPOST}`);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        registerData
      );
      console.log("Registro exitoso:", response.data);

      const successMessage =
        num_people === 1
          ? "¡Registro exitoso! 🎉\nUsted se ha registrado al evento."
          : `¡Registro exitoso! 🎉\nSe registraron ${num_people} personas al evento.`;

      toast.success(successMessage, {
        position: "top-center",
        autoClose: 5000,
        className: "custom-toast",
      });

      setIsModalOpen(false);
      setFormData(null);
    } catch (error) {
      console.error("Error al registrar:", error);

      if (error.response && error.response.data.errorCode) {
        if (error.response.data.errorCode === "LIMIT_EXCEEDED") {
          toast.error(
            `¡Error! Se superó la cantidad de inscripciones.\n${error.response.data.message}`,
            {
              position: "top-center",
              autoClose: 5000,
              className: "custom-toast",
            }
          );
        } else {
          toast.error("¡Error al registrar! 😞", {
            position: "top-center",
            autoClose: 5000,
            className: "custom-toast",
          });
        }
      } else {
        toast.error("¡Error al registrar! 😞", {
          position: "top-center",
          autoClose: 5000,
          className: "custom-toast",
        });
      }

      setIsModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelRegistration = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="register-container">
      <div className="left-half">
        <img src={Flyer} alt="Flyer del evento" className="flyer-evento" />
      </div>

      <div className="right-half">
        <a
          href="https://www.instagram.com/ocm.cde/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={OCMLogo} alt="OCM Logo" className="ocm-logo" />
        </a>

        <div className="social-icons">
          <a
            href="https://www.instagram.com/ocm.cde/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram fontSize="large" className="social-icon" />
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100078959222149"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook fontSize="large" className="social-icon" />
          </a>
        </div>

        <div className="flyer-movil-version-container">
          <img
            src={Flyer}
            alt="Flyer del evento"
            className="flyer-movil-version"
          />
        </div>

        <p>Registrá tu asistencia al evento</p>

        <Formik
          initialValues={{
            name: "",
            email: "",
            tel: "",
            num_people: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="register-form">
            <div className="input-container">
              <Person className="input-icon" />
              <Field
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre"
                className="form-input"
              />
            </div>
            <ErrorMessage
              name="name"
              component="div"
              className="error-message"
            />

            <div className="input-container">
              <Mail className="input-icon" />
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="correo@gmail.com"
                className="form-input"
              />
            </div>
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />

            <div className="input-container">
              <Phone className="input-icon" />
              <Field
                type="tel"
                id="tel"
                name="tel"
                placeholder="Tu teléfono"
                className="form-input"
              />
            </div>
            <ErrorMessage
              name="tel"
              component="div"
              className="error-message"
            />

            <label htmlFor="num_people">Cantidad de personas:</label>
            <div className="num-people-input">
              <Field
                type="number"
                id="num_people"
                name="num_people"
                className="form-input"
              />
            </div>
            <ErrorMessage
              name="num_people"
              component="div"
              className="error-message"
            />

            <button type="submit">Registráte</button>
          </Form>
        </Formik>

        <a
          href="https://mcde.gov.py/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={MuniLogo} alt="Muni Logo" className="muni-logo" />
        </a>
      </div>

      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelRegistration}
        contentLabel="Confirmar Registro"
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>¿Estás seguro de que quieres registrarte?</h2>
        <div>
          <button onClick={confirmRegistration} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "Aceptar"}
          </button>

          <button onClick={cancelRegistration} disabled={isProcessing}>
            {isProcessing ? "Cancelando..." : "Cancelar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

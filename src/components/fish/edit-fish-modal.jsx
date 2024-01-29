/* eslint-disable react/prop-types */

import { useEffect } from "react";
import ReactDOM from "react-dom";
import classes from "./scss/fish.module.scss";
import { X } from "lucide-react";
import EditFishForm from "./form/edit-fish-form";
import { useAuth } from "../../context/use-context";
import { editFish } from "../../api/fish-api";

export default function EditFish({ isOpen, setIsOpen, onEdit, fishId, name, type, gender, price, price_usd, images, desc, size, videoURL, discount, isAvailable, isEvent, isNewArrival }) {
  const { userToken } = useAuth();

  const handleEdit = async (formData) => {
    try {
      await editFish(userToken, fishId, formData);
      if (onEdit) {
        onEdit();
      }
    } catch (error) {
      console.error("Failed to edit fish:", error);
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      if (isOpen) {
        body.style.overflowY = "hidden";
      } else {
        body.style.overflowY = "scroll";
      }
    }
  }, [isOpen]);

  const content = (
    <div className={classes.modal} onClick={() => setIsOpen(false)}>
      <button className="bg-none border-none text-gray-200 text-lg absolute cursor-pointer right-2 top-2">
        <X />
      </button>
      <div onClick={(e) => e.stopPropagation()} className={classes.modalCard}>
        <h1 className="text-xl flex justify-center text-rose-500 font-bold my-3">Edit Fish</h1>
        <EditFishForm
          isAvailable={isAvailable}
          name={name}
          gender={gender}
          type={type}
          price={price}
          price_usd={price_usd}
          images={images}
          desc={desc}
          size={size}
          videoURL={videoURL}
          discount={discount}
          isEvent={isEvent}
          isNewArrival={isNewArrival}
          setIsOpen={setIsOpen}
          onSubmit={handleEdit}
        />
      </div>
    </div>
  );

  if (!isOpen) return <></>;

  return ReactDOM.createPortal(content, document.getElementById("portal"));
}

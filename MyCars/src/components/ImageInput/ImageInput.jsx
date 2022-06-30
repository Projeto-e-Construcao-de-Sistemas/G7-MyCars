import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import "./ImageInput.css";

export const ImageInput = ({ isFirst, setImageCount, imageCount, register, index, backgroundImage = "", unregister}) => {

    const [image, setImage] = useState("");


    useEffect(() => {
      setImage(backgroundImage);
    }, [backgroundImage, setImage]);
    

    function showPreview(e) {
        const files = e.target.files;
        if (!files.length || !window.FileReader) return;

        if (/^image/.test(files[0].type)) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.onloadend = function () {
                const result = this.result;
                setImage(result);
            }
        }
    }

    function deleteSelf(){
        setImageCount(imageCount - 1);
        const inputReference = document.querySelector(`#input-img-${index}`);
        inputReference.value = "";
        unregister(`fotosVeiculo[${index}]`);
    }

    return (
        <div className="col-sm-4 imgUp">
            <div className="imagePreview" id="imagePreview" style={{ backgroundImage: `url(${image})` }}></div>
            <label className="btn btn-primary">
                Adicioar imagem <input type="file" id={`input-img-${index}`} className="uploadFile img" style={{ width: "0px", height: "0px", overflow: "hidden" }} name={`fotoVeiculo[${index}]`} { ...register(`fotosVeiculo[${index}]`) } onChange={showPreview} />
            </label>
            {!isFirst && (<i className="del" onClick={deleteSelf}><FontAwesomeIcon icon={faTimes} /></i>)}
        </div>
    )
}

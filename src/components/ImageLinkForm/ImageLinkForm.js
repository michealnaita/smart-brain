import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onSubmit, onInputChange }) => {
	return (
		<div>
			<p className="f3 wht p">
				{
					"This Magic Brain will detect faces in your pictures. Give it a try"
				}
			</p>
			<div className="center">
				<div className="pa4 br3 shadow-5 center form">
					<input
						className="f4 pa2 w-70 center"
						type="text"
						onChange={onInputChange}
					/>
					<button
						className="f4 ph3 grow pv2 dib white  w-30 "
						type="submit"
						onClick={onSubmit}
					>
						Detect
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImageLinkForm;

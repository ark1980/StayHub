import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./NewSpot.css";
import { createNewSpot, addPhotosToSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";

const NewSpot = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [photo4, setPhoto4] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let newErrors = {};
    if (country.length === 0) {
      newErrors.country = "Country is required";
    }
    if (streetAddress.length === 0) {
      newErrors.streetAddress = "Address is required";
    }
    if (city.length === 0) {
      newErrors.city = "City is required";
    }
    if (state.length === 0) {
      newErrors.state = "State is required";
    }
    if (description.length < 30) {
      newErrors.description = "Description needs a minimum of 30 characters";
    }
    if (title.length === 0) {
      newErrors.title = "Name is required";
    }
    if (price.length === 0) {
      newErrors.price = "Price is required";
    }
    if (previewPhoto.length === 0) {
      newErrors.previewPhoto = "Preview image is required";
    }

    setErrors(newErrors);
  }, [
    country,
    streetAddress,
    city,
    state,
    description,
    title,
    price,
    previewPhoto,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);
    if (Object.keys(errors).length > 0) return alert(`Cannot Submit`);

    let photosArr;

    const newSpot = {
      country,
      address: streetAddress,
      city,
      state,
      description,
      name: title,
      price,
    };

    photosArr = [];

    let previewImgObj = {
      url: previewPhoto,
      preview: "true",
    };

    photosArr.push(previewImgObj);

    if (photo1) {
      photosArr.push({
        url: photo1,
        preview: "false",
      });
    }
    if (photo2) {
      photosArr.push({
        url: photo2,
        preview: "false",
      });
    }
    if (photo3) {
      photosArr.push({
        url: photo3,
        preview: "false",
      });
    }
    if (photo4) {
      photosArr.push({
        url: photo4,
        preview: "false",
      });
    }

    let createdSpot = await dispatch(createNewSpot(newSpot));

    let spotId = createdSpot.id;

    if (createdSpot) {
      dispatch(addPhotosToSpot(photosArr, spotId));
    }

    if (createdSpot) {
      history.push(`/spots/${createdSpot.id}`);
    }
  };

  return (
    <div className="new-spot-form-div">
      <form className="new-spot-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="form-title">Create a new Spot</h2>
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <label>
          Country{" "}
          <span className="error">{hasSubmitted && errors.country}</span>
          <input
            type="text"
            name="country"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Street Address{" "}
          <span className="error">{hasSubmitted && errors.streetAddress}</span>
          <input
            type="text"
            name="streetAddress"
            value={streetAddress}
            placeholder="Street Address"
            onChange={(e) => setStreetAddress(e.target.value)}
          />
        </label>
        <div className="form-stack">
          <label>
            City <span className="error">{hasSubmitted && errors.city}</span>
            <input
              type="text"
              name="city"
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            State <span className="error">{hasSubmitted && errors.state}</span>
            <input
              type="text"
              name="state"
              value={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </div>
        <div className="form-stack stack-left"></div>
        <label for="description">
          <h3>Describe your place to guests:</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          >
            {description}
          </textarea>
        </label>
        <p>
          <span className="error">{hasSubmitted && errors.description}</span>
        </p>
        <label>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Name of your spot"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <span className="error">{hasSubmitted && errors.title}</span>
        <label>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="number"
            name="price"
            value={price}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <span className="error">{hasSubmitted && errors.price}</span>
        <label>
          <h3>Liven up your spot with photos</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="text"
            name="previewPhoto"
            value={previewPhoto}
            placeholder="Preview Image URL"
            onChange={(e) => setPreviewPhoto(e.target.value)}
          />
        </label>
        <span className="error">{hasSubmitted && errors.previewPhoto}</span>
        <label>
          <input
            type="text"
            name="photo1"
            value={photo1}
            placeholder="Image URL"
            onChange={(e) => setPhoto1(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="photo2"
            value={photo2}
            placeholder="Image URL"
            onChange={(e) => setPhoto2(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="photo3"
            value={photo3}
            placeholder="Image URL"
            onChange={(e) => setPhoto3(e.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            name="photo4"
            value={photo4}
            placeholder="Image URL"
            onChange={(e) => setPhoto4(e.target.value)}
          />
        </label>
        <br />
        <div className="submit-btn">
          <button className="submit-button" type="submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSpot;

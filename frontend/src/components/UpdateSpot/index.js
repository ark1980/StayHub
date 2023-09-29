import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createNewSpot, addPhotosToSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpot, updateSpot } from "../../store/spots";

import "./UpdateSpot.css";

const UpdateSpot = () => {
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  const sessionUser = useSelector((state) => state.session.user);
  //if user not logged in, go back to home
  if (!sessionUser) history.push(`/`);

  const singleSpot = useSelector((state) => {
    return state.spots.singleSpot;
  });

  useEffect(() => {
    const fillFeilds = async () => {
      const spotInfo = await dispatch(getSingleSpot(spotId));

      setCountry(spotInfo.country);
      setStreetAddress(spotInfo.address);
      setCity(spotInfo.city);
      setState(spotInfo.state);
      setDescription(spotInfo.description);
      setTitle(spotInfo.name);
      setPrice(spotInfo.price);
    };
    fillFeilds();
  }, [dispatch]);

  //if not owner of spot, redirect to home

  let isOwner = true;
  if (
    Object.keys(singleSpot).length > 0 &&
    singleSpot.ownerId !== sessionUser.id
  )
    isOwner = false;
  if (isOwner === false) history.push(`/`);

  let spotId = useParams().spotId;

  useEffect(() => {
    let newErrors = {};

    //errors to push
    if (!country) {
      newErrors.country = "Country is required";
    }
    if (!streetAddress) {
      newErrors.streetAddress = "Address is required";
    }
    if (!city) {
      newErrors.city = "City is required";
    }
    if (!state) {
      newErrors.state = "State is required";
    }
    if (!description || description.length < 30) {
      newErrors.description = "Description needs a minimum of 30 characters";
    }
    if (!title) {
      newErrors.title = "Name is required";
    }
    if (!price) {
      newErrors.price = "Price is required";
    }

    setErrors(newErrors);
  }, [country, streetAddress, city, state, description, title, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //return if errors
    setHasSubmitted(true);
    if (Object.keys(errors).length > 0) return alert(`Cannot Submit`);

    const newSpot = {
      country,
      address: streetAddress,
      city,
      state,
      description,
      name: title,
      price,
    };

    const updatedSpot = await dispatch(updateSpot(newSpot, spotId));

    if (updatedSpot) {
      history.push(`/spots/${spotId}`);
    }
  };

  return (
    <div className="new-spot-form-div">
      <form className="new-spot-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="form-title">Update Your Spot</h2>
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
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

        <br />
        <div className="submit-btn">
          <button className="submit-button" type="submit">
            Update Your Spot
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSpot;

import React, { use, useState } from "react";
import { Formik, Field, ErrorMessage, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Appicon from "../assets/airplane.png";
import SubmitIcon from "../assets/submit-icon.png";
import DeleteIcon from "../assets/delete-icon.png";
import LoadingGif from "../assets/loading.gif";

interface TravelDetails {
  cityName: string;
  arrival: string;
  cityInfo: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  travelDetails: TravelDetails[];
}

const Form = () => {
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const [addedToForm, setAddedToForm] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [travelDetailsData, setTravelDetailsData] = useState({
    cityName: "",
    arrival: "",
    cityInfo: "",
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Enter first name"),
    lastName: Yup.string().required("Enter last name"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
  });

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    travelDetails: [],
  };

  const addToForm = (values: any, setValues: any) => {
    const updatedValues = {
      ...values,
      travelDetails: [...values.travelDetails, travelDetailsData],
    };
    setAddedToForm(true);
    setValues(updatedValues);
    setTimeout(() => {
        setAddedToForm(false);
      }, 2000);
  
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cityName" || name === "arrival") {
      setTravelDetailsData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "additionalField" && moreDetails) {
      setTravelDetailsData((prevData) => ({
        ...prevData,
        cityInfo: value,
      }));
    }
    console.log("It worked");
  };
  const onSubmit = async (values: any, actions: any) => {
    try {
      setFormSubmitted(true);
      console.log(values);
      const response = await fetch("/api/submitFormData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Form data successfully submitted to the server");
      } else {
        console.error("Failed to submit form data to the server");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }

    actions.setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values, setValues }) => (
          <FormikForm>
            <div className="rounded-md w-[75vw] h-[85vh] m-auto shadow-md bg-white">
              <div className="p-4 bg-blue-500 rounded-tr-md rounded-tl-md flex flex-row">
                <h1 className="text-xl font-bold text-white">Travel Form</h1>
                <Image
                  src={Appicon}
                  alt="app-icon"
                  width={40}
                  height={40}
                  className="ml-2"
                />
              </div>
              <div className="justify-between flex flex-row">
                <div>
                  <div className="mt-3">
                    <div className="ml-4 text-blue-800 font-semibold text-xl">
                      <h2>Personal Details:</h2>
                    </div>
                    <div className="flex flex-col gap-3 p-4">
                      <div className="flex flex-row justify-between">
                        <div className="w-[45%] flex flex-col">
                          <label>First Name:</label>
                          <Field
                            type="text"
                            name="firstName"
                            className="border p-3 border-gray-500 w-[100%] h-10 rounded-sm placeholder:p-3"
                            placeholder="First Name"
                          />
                          <ErrorMessage
                            name="firstName"
                            className="text-red-600 text-xs mt-2"
                            component="div"
                          />
                        </div>
                        <div className="w-[45%] flex flex-col">
                          <label>Last Name:</label>
                          <Field
                            type="text"
                            name="lastName"
                            className="border border-gray-500 p-3 w-[100%] h-10 rounded-sm placeholder:p-3"
                            placeholder="Last Name"
                          />
                          <ErrorMessage
                            name="lastName"
                            className="text-red-600 text-xs mt-2"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label>Date of Birth:</label>
                        <Field
                          type="date"
                          name="dateOfBirth"
                          className="border border-gray-500 w-[45%] h-10 p-3"
                          placeholder="Date of Birth"
                        />
                        <ErrorMessage
                          name="dateOfBirth"
                          className="text-red-600 text-xs mt-2"
                          component="div"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-[1px] w-[90%] my-2 m-auto bg-gray-400"></div>
                  <div className="">
                    <div>
                      <div className="p-4">
                        <p className="text-xl font-semibold text-blue-800">
                          Cities Travelled:
                        </p>
                      </div>
                      <div className="flex flex-row gap-4 px-4">
                        <div className="w-auto flex flex-col">
                          <label>City Name:</label>
                          <input
                            type="text"
                            name="cityName"
                            onChange={onChangeHandler}
                            placeholder="City Name"
                            className="border border-gray-500 p-3 w-[100%] h-10 rounded-sm placeholder:p-3"
                          />
                          <ErrorMessage
                            name="cityName"
                            className="text-red"
                            component="div"
                          />
                        </div>
                        <div className="w-auto flex flex-col">
                          <label>Date Arrived:</label>
                          <input
                            type="date"
                            name="arrival"
                            onChange={onChangeHandler}
                            placeholder="Date Arrived"
                            className="border border-gray-500 p-3 w-[100%] h-10 rounded-sm"
                          />
                          <ErrorMessage name="email" component="div" />
                        </div>

                        {moreDetails && (
                          <div className="w-[37%] flex flex-col">
                            <label>City information (optional):</label>
                            <input
                              type="textarea"
                              name="additionalField"
                              onChange={onChangeHandler}
                              placeholder="Enter city info..."
                              className="border border-gray-500 p-3 w-[100%] h-10 rounded-sm placeholder:p-3"
                            />
                            <ErrorMessage
                              name="additionalField"
                              component="div"
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-row justify-between mx-4">
                        <button
                          type="button"
                          className="bg-blue-500 w-[9vw] p-2  text-white rounded-md"
                          onClick={() => setMoreDetails(true)}
                        >
                          Add city info
                        </button>
                        <div>
                          <button
                            className="bg-green-400 w-[9vw] rounded-md text-white h-10"
                            type="button"
                            onClick={() => addToForm(values, setValues)}
                          >
                            Add to form
                          </button>
                          {addedToForm ? <p className="text-xs text-green-700">Added successfully to form</p> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="m-auto  flex justify-center mt-10 items-center ">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-400 m-auto w-[22vw] justify-center items-center h-10 text-white rounded-sm"
                    >
                      <div className="flex flex-row gap-2 m-auto w-[40%]">
                        {formSubmitted ? (
                          <p className="text-xs">Form submitted</p>
                        ) : (
                          <p>Submit</p>
                        )}

                        <Image
                          src={SubmitIcon}
                          alt="submit-icon"
                          width={23}
                          height={20}
                        />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="border-l border-blue-600 w-[40%]">
                  <div className="p-4">
                    <p className="text-xl font-semibold text-blue-700">
                      Travel Details:
                    </p>
                    {values.travelDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b-2 text-black mb-2"
                      >
                        <div>
                          <p className="text-black">
                            {detail.cityName} - {detail.arrival}
                          </p>
                          {detail.cityInfo && (
                            <p className="text-black">{detail.cityInfo}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => {
                            const updatedDetails = [...values.travelDetails];
                            updatedDetails.splice(index, 1);
                            setValues({
                              ...values,
                              travelDetails: updatedDetails,
                            });
                          }}
                        >
                          <Image
                            src={DeleteIcon}
                            width={25}
                            height={25}
                            alt="delete-icon"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default Form;

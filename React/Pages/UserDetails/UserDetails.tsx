import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { UserModel } from "../../Models/UserModel";
import { showToast } from "../../Redux/Slices/Toast.slice";
import Back from "../../assets/images/back-arrow.svg";
import authStyle from "../../assets/scss/auth.module.scss";
import AuthWrapper from "../../components/AuthWrapper/AuthWrapper";
import CustomButton from "../../components/Button/Button";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import Modal from "../../components/Modal/Modal";
import TextArea from "../../components/TextArea/TextArea";
import Input from "../../components/input/Input";
import PhoneInput from "../../components/input/PhoneInput";
import UseApiService, {
  API_URL,
  IDataObject,
  TokenData,
} from "../../services/api.service";
import { SuccessMessages } from "../../utils/errors.enums";
import { handleError } from "../../utils/helpers";
import { profileSchema } from "../../utils/schema";
import style from "./UserDetails.module.scss";

export default function UserDetails() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel>();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { userId } = useParams();

  useEffect(() => {
    // check if userId is a valid number
    if (userId && isNaN(+userId)) {
      goBack();
    } else if (userId) {
      getUserDetails(userId);
    }
  }, [userId]);

  const getUserDetails = async (userId: string) => {
    try {
      const obj: IDataObject = {
        url: API_URL.USER + "/" + userId,
        headerToken: TokenData.ACCESS,
      };
      const res = await UseApiService().get(obj);
      setCurrentUser(new UserModel(res.data?.currentUser));
      const user = new UserModel(res.data.currentUser);
      updateForm(user);
    } catch (error) {
      console.log(error);
      dispatch(showToast(handleError(error)));
    }
  };

  const handleFreezeAccount = async (url: string) => {
    try {
      noResponse();
      const obj: IDataObject = {
        url: url + "/" + userId,
        headerToken: TokenData.ACCESS,
      };
      const res = await UseApiService().post(obj);
      const user = new UserModel(res.data.currentUser);
      setCurrentUser(user);
      updateForm(user);
      dispatch(
        showToast(
          user.isActive
            ? SuccessMessages.ACCOUNT_UNFREEZE_SUCCESSFUL
            : SuccessMessages.ACCOUNT_FREEZE_SUCCESSFUL
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(showToast(handleError(error)));
    }
  };

  const updateForm = (user: UserModel) => {
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("myStylist", user?.myStylist || "");
    setValue("zipCode", user?.zipCode || "");
    setValue("phoneNumber", user?.phoneNumber || "");
    setValue("notes", user?.notes || "");
    setValue("address", user?.address || "");
    setValue("referralCode", user?.referralCode || "");
    setValue("shoppingRecsUrl", user?.shoppingRecsUrl || '')
  };

  const saveDetails = async (data: FieldValues) => {
    try {
      const obj: IDataObject = {
        url: API_URL.USER + "/" + userId,
        data: data,
        headerToken: TokenData.ACCESS,
      };
      setLoading(true);
      const res = await UseApiService().put(obj);
      const user = new UserModel(res.data.currentUser);
      updateForm(user);
      setLoading(false);
      setCurrentUser(user);
      dispatch(showToast(SuccessMessages.ACCOUNT_UPDATED_SUCCESSFULLY));
    } catch (error) {
      dispatch(showToast(handleError(error)));
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/user/list");
  };

  const noResponse = () => {
    parentRef.current?.classList.add("d-none");
  };

  const toggleConfirmationModal = (): void => {
    if (parentRef.current) {
      parentRef.current.classList.remove("d-none");
    }
  };

  const viewShoppingList = () => {
    navigate("/user/shopping-list/" + userId);
  };

  return (
    <AuthWrapper>
      <>
        <div
          className={` ${authStyle.login__innerContent} ${style.userDetail} flex flexCol justifyCenter`}
        >
          <h1 className="flex alignCenter">
            <img src={Back} alt="Back arrow" onClick={goBack} />
            <span>User Account</span>
          </h1>
          <form onSubmit={handleSubmit(saveDetails)}>
            <Input
              label={"FIRST NAME"}
              register={register}
              name={"firstName"}
              type="text"
              errors={errors}
              placeholder="Enter your first name"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
              required={true}
            />

            <Input
              label={"LAST NAME"}
              register={register}
              name={"lastName"}
              type="text"
              errors={errors}
              placeholder="Enter your last name"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
              required={true}
            />

            <Input
              label={"EMAIL"}
              register={register}
              name={"email"}
              type="text"
              errors={errors}
              placeholder="Enter your email"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
              required={true}
              readOnly={true}
            />

            <Input
              register={register}
              name="referralCode"
              label={"Referral Code"}
              type="text"
              errors={errors}
              placeholder="Enter Referral Code"
              autocomplete={"off"}
              extraClass={style.userDetail__input}
            />

            <PhoneInput
              label={"PHONE"}
              register={register}
              name={"phoneNumber"}
              type="text"
              errors={errors}
              placeholder="Enter your phone number"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
            />

            <Input
              label={"ZIP CODE"}
              register={register}
              name={"zipCode"}
              type="text"
              errors={errors}
              placeholder="Enter your zip code"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
            />

            <Input
              label={"STYLIST"}
              register={register}
              name={"myStylist"}
              type="text"
              errors={errors}
              placeholder="Not specified"
              autocomplete={"on"}
              extraClass={style.userDetail__input}
            />

            <Input
              register={register}
              name="address"
              label={"ADDRESS"}
              type="text"
              errors={errors}
              placeholder="Enter your address"
              autocomplete={"off"}
              extraClass={style.userDetail__input}
            />

            <Input
              register={register}
              name="shoppingRecsUrl"
              label={"SHOPPING RECS URL"}
              type="text"
              errors={errors}
              placeholder="Enter Url"
              autocomplete={"off"}
            />

            <TextArea
              extraClass={style.userDetail__input}
              register={register}
              name="notes"
              label={"NOTES"}
              errors={errors}
              placeholder="Enter your notes"
            />
            <div className={`${authStyle.login__actions}  flex`}>
              <CustomButton
                title="UPDATE PROFILE"
                type="submit"
                disabled={loading}
                onClick={handleSubmit(saveDetails)}
              >
                {loading && <ButtonLoader />}
              </CustomButton>

              <CustomButton
                title="SHOPPING LIST"
                type="button"
                className={"primary"}
                onClick={viewShoppingList}
              />
            </div>
          </form>
        </div>
        <div
          onClick={toggleConfirmationModal}
          className={authStyle.login__forgot}
        >
          {currentUser?.isActive ? "Freeze account" : "Unfreeze account"}?
        </div>

        <Modal
          ref={parentRef}
          yesResponse={() =>
            handleFreezeAccount(
              currentUser?.isActive ? API_URL.FREEZE : API_URL.UNFREEZE
            )
          }
          noResponse={noResponse}
        >
          <p>
            Are you sure you want to{" "}
            {currentUser?.isActive ? "freeze" : "unfreeze"} this account?
          </p>
        </Modal>
      </>
    </AuthWrapper>
  );
}

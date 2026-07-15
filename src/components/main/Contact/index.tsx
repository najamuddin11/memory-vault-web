import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../../../api/homeApi";
import CustomButton from "../../form/CustomButton";
import InputField from "../../form/InputField";
import TextArea from "../../form/TextArea";
import styles from "./contact.module.css";
import ContactCard from "./ContactCard";
import Loader from "../../general/Loader";
import type FormControlType from "../../../models/component-types/FormControlType";
import type ContactDataType from "../../../models/state-types/ContactDataType";
import type ValidationErrorType from "../../../models/state-types/ValidationErrorType";
import useWindowSize from "../../../hooks/useWindowSize";
import gsap from "gsap";

export interface ContactPropsType {
  contact?: ContactDataType[];
}

const formInitial: FormControlType = {
  name: "",
  email: "",
  message: "",
  company: "",
};

const Contact: React.FC<ContactPropsType> = ({ contact }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formControl, setFormControl] = useState<FormControlType>(formInitial);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorType | null>(null);
  const [status, setStatus] = useState<number | undefined>();

  const { mutate: submitContact, isPending: loading } = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      setStatus(200);
      setValidationErrors(null);
      setFormControl(formInitial);
    },
    onError: (error: unknown) => {
      const gqlError = (
        error as {
          response?: {
            errors?: Array<{
              extensions?: {
                code?: string;
                validationErrors?: Record<string, string>;
              };
            }>;
          };
        }
      )?.response?.errors?.[0];

      const code = gqlError?.extensions?.code;
      const fieldErrors = gqlError?.extensions?.validationErrors;

      setStatus(code === "BAD_USER_INPUT" ? 422 : 500);
      setValidationErrors(
        fieldErrors ? { data: { validationErrors: fieldErrors } } : null,
      );

      if (code !== "BAD_USER_INPUT") {
        setFormControl(formInitial);
      }
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormControl((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors(null);
    submitContact(formControl);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(undefined);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  const windowWidth = useWindowSize();

  const isDesktop = windowWidth > 768;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const heading1El = containerRef.current.querySelector(
      "[data-contact-heading1]",
    );
    const heading2El = containerRef.current.querySelector(
      "[data-contact-heading2]",
    );
    const form = containerRef.current.querySelector("[data-contact-form]");
    const cards = containerRef.current.querySelector("[data-contact-cards]");

    const ctx = gsap.context(() => {
      if (!isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play pause resume reset",
          },
        });
        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 })
          .from(cards, { y: 50, opacity: 0, duration: 0.6 })
          .from(form, { y: 50, opacity: 0, duration: 0.6 });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${containerRef.current?.offsetHeight}`,
            scrub: true,
            pin: true,
          },
        });
        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 })
          .from(form, { y: 50, opacity: 0, duration: 0.6 })
          .from(cards, { y: 50, opacity: 0, duration: 0.6 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [windowWidth]);

  return (
    <section id="contact" className="bg_primary_gradient_effect">
      <div className="container" ref={containerRef}>
        <h5 data-contact-heading1>Contact me</h5>
        <h2 data-contact-heading2>Contact me</h2>
        <div className={`${styles.contact_inner_container}`}>
          <div className={`${styles.contact_row}`}>
            <form
              onSubmit={handleSubmit}
              className={`${styles.form_container}`}
              data-contact-form
            >
              {status &&
                (status === 200 ? (
                  <div
                    className={`${styles.alert_message} ${styles.alert_success}`}
                  >
                    Your Message Has Been Sent
                  </div>
                ) : (
                  <div
                    className={`${styles.alert_message} ${styles.alert_error}`}
                  >
                    Something Went Wrong! Please Try Again
                  </div>
                ))}

              <InputField
                type="text"
                value={formControl.name}
                name="name"
                handleChange={handleChange}
                placeholder="Name"
                error={
                  validationErrors?.data?.validationErrors?.name
                    ? validationErrors?.data?.validationErrors?.name
                    : false
                }
              />
              <InputField
                type="email"
                value={formControl.email}
                name="email"
                handleChange={handleChange}
                placeholder="Email"
                error={
                  validationErrors?.data?.validationErrors?.email
                    ? validationErrors?.data?.validationErrors?.email
                    : false
                }
              />
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  value={formControl.company}
                  name="company"
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <TextArea
                type="text"
                value={formControl.message}
                name="message"
                handleChange={handleChange}
                placeholder="Message"
                error={
                  validationErrors?.data?.validationErrors?.message
                    ? validationErrors?.data?.validationErrors?.message
                    : false
                }
              />
              <CustomButton
                text={loading ? <Loader size={"25px"} /> : "Send Message"}
                type="submit"
              />
            </form>
            <div
              data-contact-cards
              className={`${styles.contact_right_column}`}
            >
              {contact?.map((item) => (
                <ContactCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);

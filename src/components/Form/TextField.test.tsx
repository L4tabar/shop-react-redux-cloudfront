import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TextField, { fieldToTextField } from "./TextField";

const baseField = {
  name: "testField",
  value: "",
  onChange: vi.fn(),
  onBlur: vi.fn(),
};

const baseForm = {
  isSubmitting: false,
  touched: {},
  errors: {},
};

describe("fieldToTextField", () => {
  it("returns correct props when no error", () => {
    const props = fieldToTextField({
      field: baseField,
      form: baseForm,
      helperText: "helper",
      disabled: false,
    } as any);
    expect(props.error).toBe(false);
    expect(props.helperText).toBe("helper");
    expect(props.disabled).toBe(false);
  });

  it("returns error and error text when touched and error present", () => {
    const props = fieldToTextField({
      field: baseField,
      form: {
        ...baseForm,
        touched: { testField: true },
        errors: { testField: "Required" },
      },
      helperText: "helper",
    } as any);
    expect(props.error).toBe(true);
    expect(props.helperText).toBe("Required");
  });

  it("uses disabled from isSubmitting if not provided", () => {
    const props = fieldToTextField({
      field: baseField,
      form: { ...baseForm, isSubmitting: true },
    } as any);
    expect(props.disabled).toBe(true);
  });

  it("calls custom onBlur if provided", () => {
    const customOnBlur = vi.fn();
    const props = fieldToTextField({
      field: baseField,
      form: baseForm,
      onBlur: customOnBlur,
    } as any);
    props.onBlur && props.onBlur({} as any);
    expect(customOnBlur).toHaveBeenCalled();
  });
});

describe("TextField component", () => {
  it("renders with value and name", () => {
    render(
      <TextField
        field={baseField}
        form={baseForm}
        label="Test Label"
        helperText="helper"
      />
    );
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label")).toHaveValue("");
    expect(screen.getByText("helper")).toBeInTheDocument();
  });

  it("shows error text when touched and error present", () => {
    render(
      <TextField
        field={baseField}
        form={{
          ...baseForm,
          touched: { testField: true },
          errors: { testField: "Required" },
        }}
        label="Test Label"
        helperText="helper"
      />
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("calls onBlur handler", () => {
    const onBlur = vi.fn();
    render(
      <TextField
        field={baseField}
        form={baseForm}
        label="Test Label"
        onBlur={onBlur}
      />
    );
    fireEvent.blur(screen.getByLabelText("Test Label"));
    expect(onBlur).toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <TextField
        field={baseField}
        form={baseForm}
        label="Test Label"
        disabled
      />
    );
    expect(screen.getByLabelText("Test Label")).toBeDisabled();
  });
});


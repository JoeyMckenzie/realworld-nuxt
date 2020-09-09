import { mount } from "@vue/test-utils"
import Footer from "@/components/Footer.vue";

describe("Footer component", () => {
  test("is a Vue instance", () => {
    // Arrange
    const wrapper = mount(Footer);

    // Assert
    expect(wrapper.vm).toBeTruthy();
  });

  test("should display the footer text", () => {
    // Arrange
    const wrapper = mount(Footer);

    // Act
    const footerText = wrapper.get(".attribution");

    // Assert
    expect(footerText).not.toBeUndefined();
    expect(footerText.text()).toBe("An interactive learning project from Thinkster. Code & design licensed under MIT.")
  })
})

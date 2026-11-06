window.portfolioContact = (() => {
  const decode = (codes) => String.fromCharCode(...codes);

  const emailAddress = decode([
    104, 101, 110, 114, 105, 107, 98, 101, 115, 107, 101,
    64, 103, 109, 97, 105, 108, 46, 99, 111, 109
  ]);

  const phoneNumber = decode([
    43, 52, 53, 50, 52, 52, 57, 55, 53, 53, 53
  ]);
  const phoneDisplay = decode([
    40, 43, 52, 53, 41, 32, 50, 52, 32, 52, 57,
    32, 55, 53, 32, 53, 53
  ]);

  const states = {
    email: {
      href: `mailto:${emailAddress}`,
      text: emailAddress,
      ariaLabel: 'Email address',
    },
    phone: {
      href: `tel:${phoneNumber}`,
      text: phoneDisplay,
      ariaLabel: 'Phone number',
    },
  };

  const apply = (element, kind) => {
    const state = states[kind];
    if (!element || !state) {
      return;
    }

    element.href = state.href;
    element.textContent = state.text;
    element.setAttribute('aria-label', state.ariaLabel);
  };

  return { apply };
})();

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let name = '';
  let email = '';
  let phone = '';
  let message = '';
  let sendToMe = true;

  function onSubmit(event: SubmitEvent | MouseEvent) {
    dispatch('submit', {
      name,
      email,
      phone,
      message,
      sendToMe
    });
    return false;
  }

  function onCancelClicked() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={onSubmit} action="">
  <div class="field">
    <label class="label" for="your-name">Name</label>
    <div class="control">
      <input class="input" id="your-name" type="text" placeholder="Max Mustermann" required bind:value={name} />
    </div>
  </div>

  <div class="field">
    <label class="label" for="your-mail">Email-Adresse</label>
    <div class="control">
      <input class="input" id="your-mail" type="email" inputmode="email" placeholder="info@example.com" required bind:value={email} />
    </div>
  </div>

  <div class="field">
    <label class="label" for="your-phone">Telefonnummer</label>
    <div class="control">
      <input class="input" id="your-phone" type="tel" inputmode="tel" placeholder="0123456789" minlength="6" required bind:value={phone} />
    </div>
  </div>

  <div class="field">
    <label class="label" for="your-message">Nachricht</label>
    <div class="control">
      <textarea class="textarea" id="your-message" placeholder="Lieber Anbieter," required bind:value={message} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" required />
        <a
          href="https://www.dhv.de/fileadmin/user_upload/aktuell_zu_halten/gebrauchtmarkt/gm_nutzungsbedingungen.pdf"
          target="_blank"
          rel="noreferrer">AGB</a
        > gelesen und akzeptiert
      </label>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" bind:checked={sendToMe} />
        Kopie an mich selbst
      </label>
    </div>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button type="submit" class="button is-link">Senden</button>
    </div>
    <div class="control">
      <button class="button is-link is-light" on:click={onCancelClicked}>Abbrechen</button>
    </div>
  </div>
</form>

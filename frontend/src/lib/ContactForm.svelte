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
    event.preventDefault();
    return false;
  }

  function onCancelClicked() {
    dispatch('cancel');
  }
</script>

<form on:submit={onSubmit} action="">
  <div class="field">
    <label class="label">Dein Name</label>
    <div class="control">
      <input class="input" type="text" placeholder="Max Mustermann" required bind:value={name} />
    </div>
  </div>

  <div class="field">
    <label class="label">Deine Email-Adresse</label>
    <div class="control has-icons-left">
      <input class="input" type="email" placeholder="info@example.com" required bind:value={email} />
      <span class="icon is-small is-left">
        <i class="fas fa-envelope" />
      </span>
    </div>
  </div>

  <div class="field">
    <label class="label">Deine Telefonnummer</label>
    <div class="control has-icons-left">
      <input class="input" type="tel" placeholder="+49123456789" minlength="6" pattern="\+?[0-9]+" required bind:value={phone} />
      <span class="icon is-small is-left">
        <i class="fas fa-phone" />
      </span>
    </div>
  </div>

  <div class="field">
    <label class="label">Deine Nachricht an den Anbieter</label>
    <div class="control">
      <textarea class="textarea" placeholder="Deine Nachricht" required bind:value={message} />
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" required />
        <a
          href="https://www.dhv.de/fileadmin/user_upload/aktuell_zu_halten/gebrauchtmarkt/gm_nutzungsbedingungen.pdf"
          target="_blank"
          rel="noopener">AGB</a
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

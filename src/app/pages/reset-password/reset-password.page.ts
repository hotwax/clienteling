import { Component, Inject, OnInit } from '@angular/core';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { MustMatch } from '../../shared/validator/must-match.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../services/auth.provider'
import { HttpResponse } from '@angular/common/http';
import { WidgetUtils } from '../../shared/widget.util';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
})
export class ResetPasswordPage implements OnInit {

  updatePasswordForm: FormGroup;
  showPassword: boolean = false
  constructor(
    public translation: L10nTranslationService,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private widgetUtils: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    const passwordPattern = '^(?=.*[!@#$&*])(?=.*[0-9]).{8,}$';
    // ^                         Start anchor
    // (?=.*[!@#$&*])            Ensure string has one special case letter.
    // (?=.*[0-9])               Ensure string has one digits.
    // .{8,}                     Ensure string is of length 8 or more
    // $     
    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(passwordPattern)]], 
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
      newPasswordVerify: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
    }, {
      validator: MustMatch('newPassword', 'newPasswordVerify')
    });
  }

  ngOnInit() {
  }

  updatePassword(oldPassword, newPassword, newPasswordVerify) {
    this.widgetUtils.showLoading('');
    this.authProvider.updatePassword({
      oldPassword,
      newPassword,
      newPasswordVerify
    }).subscribe(
      (response: HttpResponse<any>) => {
        this.widgetUtils.hideLoading();
        this.updatePasswordForm.reset()
        if (response.body.updateSuccessful) {
          this.widgetUtils.showToast(this.translation.translate("Password updated successfully"));
        } else {
          this.widgetUtils.showToast(this.translation.translate("Something went wrong"));
        }
      },
      err => {
        // TODO Internationalise all the error messages
        this.widgetUtils.hideLoading();
        console.error("err", err);
        // Used trim to remove any line breaks at end. Due to line break internationalised text doesn't work
        this.widgetUtils.showToast(this.translation.translate(err.error.errors.trim()));
      }
    );
  }
}

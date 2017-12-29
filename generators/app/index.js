'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');
// Const lodash = require('lodash');

module.exports = class extends Generator {
  prompting() {
    // Greet the user.
    this.log(chalk.green(figlet.textSync('Altria')));
    this.log(chalk.yellow('Altria Component Generator'));

    const prompts = [{
        type: 'input',
        name: 'compName',
        message: 'Component name'
      },
      {
        type: 'input',
        name: 'compDesc',
        message: 'Component Description'
      },
      {
        type: 'confirm',
        name: 'isResponsive',
        message: 'Is Responsive?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    console.log('in writing');
    populatingData(this, 'json');
    populatingData(this, 'hbs');
    populatingData(this, 'scss');
    populatingData(this, 'js');
    populatingData(this, 'spec.js');
    if (this.props.isResponsive) {
      this.fs.copy(
        this.templatePath('sass/'),
        this.destinationPath(this.props.compName + '/sass/'),
        this.props
      );
    }
    this.fs.copy(
      this.templatePath('context/'),
      this.destinationPath(this.props.compName + '/context/'),
      this.props
    );
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(this.props.compName + 'README.md')
    );
  }

  install() {
    this.installDependencies();
  }
};

function populatingData(scope, fileExt) {
  console.log('extension' + fileExt);
  scope.fs.copyTpl(
    scope.templatePath('component.' + fileExt),
    scope.destinationPath(
      scope.props.compName + '/' + scope.props.compName + '.' + fileExt
    ),
    scope.props
  );
}

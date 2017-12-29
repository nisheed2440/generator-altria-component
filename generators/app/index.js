'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');
const lodash = require('lodash');

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
      this.props.compName = lodash.camelCase(props.compName);
      this.props.compfileName = lodash.kebabCase(props.compName);
    });
  }

  _populatingData( fileExt ) {
    this.fs.copyTpl(
      this.templatePath('component.' + fileExt),
      this.destinationPath(
        this.props.compfileName + '/' + this.props.compfileName + '.' + fileExt
      ),
      this.props
    );
  }
  writing() {
    this._populatingData('json');
    this._populatingData('hbs');
    this._populatingData('scss');
    this._populatingData('js');
    this._populatingData('spec.js');
    if (this.props.isResponsive) {
      this.fs.copy(
        this.templatePath('sass/'),
        this.destinationPath(this.props.compfileName + '/sass/'),
        this.props
      );
    }
    this.fs.copy(
      this.templatePath('context/'),
      this.destinationPath(this.props.compfileName + '/context/'),
      this.props
    );
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(this.props.compfileName + 'README.md')
    );
  }

  install() {
    this.installDependencies();
  }
};

'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');
const _ = require('lodash');
const inquirer = require('inquirer');

module.exports = class extends Generator {
  prompting() {
    // Greet the user.
    this.log(chalk.green(figlet.textSync('Altria')));
    this.log(chalk.yellow(' Altria Component Generator\n'));

    const prompts = [{
        type: 'input',
        name: 'compName',
        message: 'Component name: ',
        validate: function(input) {
          var done = this.async();

          if(_.trim(input) === '') {
            return done(chalk.bold.red('Error: ') + chalk.bold.yellow('You need to provide a component name!'));
          }

          return done(null, true);
        }
      },
      {
        type: 'input',
        name: 'compDesc',
        message: 'Component Description: ',
        validate: function(input) {
          var done = this.async();

          if(_.trim(input) === '') {
            return done(chalk.bold.red('Error: ') + chalk.bold.yellow('You need to provide a component description!'));
          }

          return done(null, true);
        }
      },
      {
        type: 'confirm',
        name: 'isResponsive',
        message: 'Is Responsive?: ',
        default: true
      },
      {
        type: 'confirm',
        name: 'isPathCorrect',
        message: 'Do you want to create the files in ' + chalk.bold.yellow(this.config.get('destinationPath')) + '? ',
        default: true
      },
      {
        when: function (response) {
          return !response.isPathCorrect;
        },
        name: 'destinationPath',
        message: 'Please enter the component path: ',
        validate: function(input) {
          var done = this.async();

          if(_.trim(input) === '') {
            return done(chalk.bold.red('Error: ') + chalk.bold.yellow('You need to provide a component path!'));
          }

          return done(null, true);
        }
      }
    ];

    return inquirer.prompt(prompts).then(props => {
      const componentName = _.trim(props.compName);
      props.compName = _.camelCase(componentName);
      props.compNameFile = _.kebabCase(componentName);
      props.compNamePretty = _.startCase(componentName);
      props.isPathCorrect && ( props.destinationPath = this.config.get('destinationPath')); 
      this.props = props;
    });
  }

  _populatingData( fileExt ) {
    this.fs.copyTpl(
      this.templatePath('component.' + fileExt),
      this.destinationPath(
        this.props.destinationPath + '/' +this.props.compNameFile + '/' + this.props.compNameFile + '.' + fileExt
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
        this.destinationPath(this.props.destinationPath + '/' +this.props.compNameFile + '/sass/'),
        this.props
      );
    }
    this.fs.copy(
      this.templatePath('context/'),
      this.destinationPath(this.props.destinationPath + '/' +this.props.compNameFile + '/context/'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(this.props.destinationPath + '/' +this.props.compNameFile + '/README.md'),
      this.props
    );
  }

  install() {
    // No dependancies to be installed!
  }
};

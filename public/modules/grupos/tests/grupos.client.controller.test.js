'use strict';

(function() {
	// Grupos Controller Spec
	describe('Grupos Controller Tests', function() {
		// Initialize global variables
		var GruposController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Grupos controller.
			GruposController = $controller('GruposController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grupo object fetched from XHR', inject(function(Grupos) {
			// Create sample Grupo using the Grupos service
			var sampleGrupo = new Grupos({
				name: 'New Grupo'
			});

			// Create a sample Grupos array that includes the new Grupo
			var sampleGrupos = [sampleGrupo];

			// Set GET response
			$httpBackend.expectGET('grupos').respond(sampleGrupos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grupos).toEqualData(sampleGrupos);
		}));

		it('$scope.findOne() should create an array with one Grupo object fetched from XHR using a grupoId URL parameter', inject(function(Grupos) {
			// Define a sample Grupo object
			var sampleGrupo = new Grupos({
				name: 'New Grupo'
			});

			// Set the URL parameter
			$stateParams.grupoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/grupos\/([0-9a-fA-F]{24})$/).respond(sampleGrupo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grupo).toEqualData(sampleGrupo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grupos) {
			// Create a sample Grupo object
			var sampleGrupoPostData = new Grupos({
				name: 'New Grupo'
			});

			// Create a sample Grupo response
			var sampleGrupoResponse = new Grupos({
				_id: '525cf20451979dea2c000001',
				name: 'New Grupo'
			});

			// Fixture mock form input values
			scope.name = 'New Grupo';

			// Set POST response
			$httpBackend.expectPOST('grupos', sampleGrupoPostData).respond(sampleGrupoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grupo was created
			expect($location.path()).toBe('/grupos/' + sampleGrupoResponse._id);
		}));

		it('$scope.update() should update a valid Grupo', inject(function(Grupos) {
			// Define a sample Grupo put data
			var sampleGrupoPutData = new Grupos({
				_id: '525cf20451979dea2c000001',
				name: 'New Grupo'
			});

			// Mock Grupo in scope
			scope.grupo = sampleGrupoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/grupos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grupos/' + sampleGrupoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid grupoId and remove the Grupo from the scope', inject(function(Grupos) {
			// Create new Grupo object
			var sampleGrupo = new Grupos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grupos array and include the Grupo
			scope.grupos = [sampleGrupo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/grupos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrupo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grupos.length).toBe(0);
		}));
	});
}());
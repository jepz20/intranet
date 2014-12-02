'use strict';

(function() {
	// Programas Controller Spec
	describe('Programas Controller Tests', function() {
		// Initialize global variables
		var ProgramasController,
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

			// Initialize the Programas controller.
			ProgramasController = $controller('ProgramasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Programa object fetched from XHR', inject(function(Programas) {
			// Create sample Programa using the Programas service
			var samplePrograma = new Programas({
				name: 'New Programa'
			});

			// Create a sample Programas array that includes the new Programa
			var sampleProgramas = [samplePrograma];

			// Set GET response
			$httpBackend.expectGET('programas').respond(sampleProgramas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.programas).toEqualData(sampleProgramas);
		}));

		it('$scope.findOne() should create an array with one Programa object fetched from XHR using a programaId URL parameter', inject(function(Programas) {
			// Define a sample Programa object
			var samplePrograma = new Programas({
				name: 'New Programa'
			});

			// Set the URL parameter
			$stateParams.programaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/programas\/([0-9a-fA-F]{24})$/).respond(samplePrograma);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.programa).toEqualData(samplePrograma);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Programas) {
			// Create a sample Programa object
			var sampleProgramaPostData = new Programas({
				name: 'New Programa'
			});

			// Create a sample Programa response
			var sampleProgramaResponse = new Programas({
				_id: '525cf20451979dea2c000001',
				name: 'New Programa'
			});

			// Fixture mock form input values
			scope.name = 'New Programa';

			// Set POST response
			$httpBackend.expectPOST('programas', sampleProgramaPostData).respond(sampleProgramaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Programa was created
			expect($location.path()).toBe('/programas/' + sampleProgramaResponse._id);
		}));

		it('$scope.update() should update a valid Programa', inject(function(Programas) {
			// Define a sample Programa put data
			var sampleProgramaPutData = new Programas({
				_id: '525cf20451979dea2c000001',
				name: 'New Programa'
			});

			// Mock Programa in scope
			scope.programa = sampleProgramaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/programas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/programas/' + sampleProgramaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid programaId and remove the Programa from the scope', inject(function(Programas) {
			// Create new Programa object
			var samplePrograma = new Programas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Programas array and include the Programa
			scope.programas = [samplePrograma];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/programas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePrograma);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.programas.length).toBe(0);
		}));
	});
}());